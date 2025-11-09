const express = require('express');
const router = new express.Router();
const controller = require('../controllers/finance.controller');
const middleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/finance/calculate:
 *   post:
 *     summary: Calculate finance or lease payment
 *     tags: [Finance]
 *     description: Calculate monthly payments for financing or leasing a vehicle without saving
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinanceCalculation'
 *           example:
 *             price: 30000
 *             downPayment: 5000
 *             termMonths: 36
 *             creditTier: excellent
 *             purchaseType: finance
 *     responses:
 *       200:
 *         description: Payment calculation successful
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/FinanceResult'
 *                 - $ref: '#/components/schemas/LeaseResult'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/calculate", controller.calculatePayment);

/**
 * @swagger
 * /api/finance/credit-tiers:
 *   get:
 *     summary: Get available credit tiers and APR rates
 *     tags: [Finance]
 *     description: Returns all credit tiers with their corresponding APR percentages
 *     responses:
 *       200:
 *         description: List of credit tiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creditTiers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CreditTier'
 */
router.get("/credit-tiers", controller.getCreditTiers);

/**
 * @swagger
 * /api/finance/quotes:
 *   post:
 *     summary: Save a financing quote
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - vehicleId
 *               - price
 *               - termMonths
 *               - creditTier
 *               - purchaseType
 *             properties:
 *               userId:
 *                 type: integer
 *               vehicleId:
 *                 type: integer
 *               price:
 *                 type: number
 *               downPayment:
 *                 type: number
 *               termMonths:
 *                 type: integer
 *               creditTier:
 *                 type: string
 *               purchaseType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quote saved successfully
 *       404:
 *         description: Vehicle not found
 *       401:
 *         description: Unauthorized
 */
router.post("/quotes", middleware.verifyToken, controller.createQuote);

/**
 * @swagger
 * /api/finance/quotes:
 *   get:
 *     summary: Get all user quotes
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user quotes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quotes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VehicleQuote'
 */
router.get("/quotes", middleware.verifyToken, controller.getUserQuotes);

router.get("/quotes/:quoteId", middleware.verifyToken, controller.getQuote);
router.put("/quotes/:quoteId", middleware.verifyToken, controller.updateQuote);

/**
 * @swagger
 * /api/finance/quotes/{quoteId}:
 *   delete:
 *     summary: Delete a quote
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quoteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quote deleted successfully
 *       404:
 *         description: Quote not found
 */
router.delete("/quotes/:quoteId", middleware.verifyToken, controller.deleteQuote);

module.exports = router;