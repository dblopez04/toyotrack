const db = require("../models");
const VehicleQuote = db.VehicleQuote;
const Vehicle = db.Vehicle;

const CREDIT_TIER_APR = {
    excellent: 0.049,
    good: 0.069,
    fair: 0.099,
    poor: 0.149
};

const RESIDUAL_BY_TERM = {
    24: 0.65,
    36: 0.60,
    48: 0.55
};

const calculateFinancePayment = (price, downPayment, apr, termMonths) => {
    const principal = price - downPayment;
    const monthlyRate = apr / 12;

    if (monthlyRate === 0) {
        return principal / termMonths;
    }

    const payment = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)));
    return payment;
};

const calculateLeasePayment = (price, downPayment, apr, termMonths) => {
    const residualPercent = RESIDUAL_BY_TERM[termMonths] || 0.55;
    const residualValue = price * residualPercent;
    const capCost = price - downPayment;

    const depreciationMonthly = (capCost - residualValue) / termMonths;

    const monthlyRate = apr / 12;
    const financeMonthly = (capCost + residualValue) * monthlyRate;

    const leasePayment = depreciationMonthly + financeMonthly;

    return {
        payment: leasePayment,
        residualValue,
        depreciationMonthly,
        financeMonthly
    };
};

exports.calculatePayment = async (req, res) => {
    try {
        const {
            vehicleId,
            price,
            downPayment,
            termMonths,
            creditTier,
            purchaseType
        } = req.body;

        if (!price || !termMonths || !creditTier || !purchaseType) {
            return res.status(400).send({
                message: "Missing required fields: price, termMonths, creditTier, purchaseType"
            });
        }

        if (!['finance', 'lease'].includes(purchaseType)) {
            return res.status(400).send({
                message: "purchaseType must be 'finance' or 'lease'"
            });
        }

        if (!CREDIT_TIER_APR[creditTier]) {
            return res.status(400).send({
                message: "Invalid creditTier. Must be: excellent, good, fair, or poor"
            });
        }

        const validTerms = purchaseType === 'lease' ? [24, 36, 48] : [24, 36, 48, 60, 72];
        if (!validTerms.includes(termMonths)) {
            return res.status(400).send({
                message: `Invalid termMonths for ${purchaseType}. Valid options: ${validTerms.join(', ')}`
            });
        }

        const down = downPayment || 0;
        if (down < 0 || down > price) {
            return res.status(400).send({
                message: "downPayment must be between 0 and vehicle price"
            });
        }

        const apr = CREDIT_TIER_APR[creditTier];

        if (purchaseType === 'finance') {
            const monthlyPayment = calculateFinancePayment(price, down, apr, termMonths);
            const totalCost = (monthlyPayment * termMonths) + down;
            const totalInterest = totalCost - price;

            return res.send({
                purchaseType: 'finance',
                monthlyPayment: Math.round(monthlyPayment * 100) / 100,
                termMonths,
                downPayment: down,
                dueAtSigning: down,
                apr: apr,
                creditTier,
                totalCost: Math.round(totalCost * 100) / 100,
                totalInterest: Math.round(totalInterest * 100) / 100,
                amountFinanced: price - down
            });
        } else {
            const leaseCalc = calculateLeasePayment(price, down, apr, termMonths);
            const fees = 500;
            const dueAtSigning = down + leaseCalc.payment + fees;

            return res.send({
                purchaseType: 'lease',
                monthlyPayment: Math.round(leaseCalc.payment * 100) / 100,
                termMonths,
                downPayment: down,
                dueAtSigning: Math.round(dueAtSigning * 100) / 100,
                apr: apr,
                creditTier,
                residualValue: Math.round(leaseCalc.residualValue * 100) / 100,
                acquisitionFee: fees,
                depreciationMonthly: Math.round(leaseCalc.depreciationMonthly * 100) / 100,
                financeMonthly: Math.round(leaseCalc.financeMonthly * 100) / 100
            });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.createQuote = async (req, res) => {
    try {
        const {
            userId,
            vehicleId,
            price,
            downPayment,
            termMonths,
            creditTier,
            purchaseType
        } = req.body;

        // Validation
        if (!userId || !vehicleId || !price || !termMonths || !creditTier || !purchaseType) {
            return res.status(400).send({
                message: "Missing required fields"
            });
        }

        // Verify vehicle exists
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).send({ message: "Vehicle not found" });
        }

        const down = downPayment || 0;
        const apr = CREDIT_TIER_APR[creditTier];

        let monthlyPayment;
        if (purchaseType === 'finance') {
            monthlyPayment = calculateFinancePayment(price, down, apr, termMonths);
        } else {
            const leaseCalc = calculateLeasePayment(price, down, apr, termMonths);
            monthlyPayment = leaseCalc.payment;
        }

        const quote = await VehicleQuote.create({
            userId,
            vehicleId,
            termLengthMonths: termMonths,
            apr,
            downPayment: down,
            estimatedPayment: Math.round(monthlyPayment * 100) / 100
        });

        res.status(201).send({
            message: "Quote saved successfully",
            quote
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getUserQuotes = async (req, res) => {
    try {
        const userId = req.id;

        const quotes = await VehicleQuote.findAll({
            where: { userId },
            include: [{
                model: Vehicle,
                attributes: ['id', 'make', 'model', 'year', 'baseMsrp']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.send({ quotes });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getQuote = async (req, res) => {
    try {
        const quoteId = req.params.quoteId;
        const userId = req.id;

        const quote = await VehicleQuote.findOne({
            where: {
                id: quoteId,
                userId
            },
            include: [{
                model: Vehicle,
                attributes: ['id', 'make', 'model', 'year', 'baseMsrp']
            }]
        });

        if (!quote) {
            return res.status(404).send({ message: "Quote not found" });
        }

        res.send({ quote });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updateQuote = async (req, res) => {
    try {
        const quoteId = req.params.quoteId;
        const userId = req.id;
        const { downPayment, termLengthMonths, apr } = req.body;

        const quote = await VehicleQuote.findOne({
            where: {
                id: quoteId,
                userId
            }
        });

        if (!quote) {
            return res.status(404).send({ message: "Quote not found" });
        }

        await quote.update({
            downPayment: downPayment !== undefined ? downPayment : quote.downPayment,
            termLengthMonths: termLengthMonths !== undefined ? termLengthMonths : quote.termLengthMonths,
            apr: apr !== undefined ? apr : quote.apr
        });

        res.send({
            message: "Quote updated successfully",
            quote
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteQuote = async (req, res) => {
    try {
        const quoteId = req.params.quoteId;
        const userId = req.id;

        const deleted = await VehicleQuote.destroy({
            where: {
                id: quoteId,
                userId
            }
        });

        if (!deleted) {
            return res.status(404).send({ message: "Quote not found" });
        }

        res.send({ message: "Quote deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getCreditTiers = (req, res) => {
    res.send({
        creditTiers: Object.keys(CREDIT_TIER_APR).map(tier => ({
            tier,
            apr: CREDIT_TIER_APR[tier],
            aprPercent: (CREDIT_TIER_APR[tier] * 100).toFixed(1) + '%'
        }))
    });
};