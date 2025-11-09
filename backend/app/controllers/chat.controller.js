const { GoogleGenAI } = require("@google/genai");
const db = require("../models");
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function userContext(userId){
    const context = [];
    try {
        const preferences = await db.UserPreferences.findOne({
            where: { userId }
        });
        const finances = await db.UserFinance.findOne({
            where: { userId }
        });
        
        if (preferences) {
            context.push("User Context:")
            if (preferences.budget) {
                context.push(`- Budget: $${preferences.budget.toLocaleString()}`);
            }
            if (preferences.carType) {
                context.push(`- Preferred Car Type: ${preferences.carType}`);
            }
            if (preferences.fuelType) {
                context.push(`- Preferred Fuel Type: ${preferences.carType}`);
            }
        }
        if (finances) {
            context.push(`- Credit Score Tier: ${finances.creditTier}`);
        }

        const quotes = await db.VehicleQuote.findAll({
            where: { userId },
            include: [{
                model: db.Vehicle,
                attributes: ['id', 'make', 'model', 'year', 'baseMsrp']
            }],
            limit: 3,
            order: [['createdAt', 'DESC']]
        });

        if (quotes.length > 0) {
            context.push("\nRecent Quotes:");
            quotes.forEach(q => {
                const vehicle = q.Vehicle;
                context.push(`- ${vehicle.year} ${vehicle.make} ${vehicle.model}: $${q.estimatedPayment}/month for ${q.termLengthMonths} months (APR: ${(q.apr * 100).toFixed(1)}%)`);
            });
        }

        const bookmarks = await db.UserBookmark.findAll({
            where: { userId },
            include: [{
                model: db.Vehicle,
                attributes: ['id', 'make', 'model', 'year', 'baseMsrp']
            }],
            limit: 3
        });

        if (bookmarks.length > 0) {
            context.push("\nBookmarked Vehicles:");
            bookmarks.forEach(b => {
                const vehicle = b.Vehicle;
                context.push(`- ${vehicle.year} ${vehicle.make} ${vehicle.model} (MSRP: $${vehicle.baseMsrp.toLocaleString()})`);
            });
        }

        return context.length > 0 ? context.join('\n') : null;

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

function createSystemPrompt(userContext) {
    let prompt = `You are ToyoTrack's AI finance assistant, an expert in automotive financing and leasing for Toyota vehicles.

    Your Role:
    - Help users understand financing vs leasing
    - Explain payment calculations and terms
    - Provide advice on credit tiers and APR rates
    - Answer questions about down payments, term lengths, and total costs
    - Be friendly, professional, and educational

    Available Financing Options:
    - Credit Tiers: Excellent (4.9% APR), Good (6.9% APR), Fair (9.9% APR), Poor (14.9% APR)
    - Finance Terms: 24, 36, 48, 60, or 72 months
    - Lease Terms: 24, 36, or 48 months
    - Lease Residual Values: 24mo (65%), 36mo (60%), 48mo (55%)

    Finance Payment Formula: payment = P x (r / (1 - (1 + r)^(-n)))
    where P = price - down payment, r = monthly rate (APR/12), n = months

    Lease Payment: Depreciation + Finance Charge
    - Depreciation = (Capitalized Cost - Residual Value) / months
    - Finance Charge = (Capitalized Cost + Residual Value) x monthly rate

    Important Guidelines:
    - If asked to calculate, remind users they can get exact quotes through the app
    - Focus on education rather than making decisions for users
    - Be concise but thorough
    - Use simple language to explain complex finance concepts
    - Always mention that rates and payments are estimates`;

    if (userContext) {
        prompt += `\n\nCurrent User Information:\n${userContext}`;
        prompt += `\n\nUse this information to provide personalized advice, but don't mention specific details unless relevant to the question.`;
    }

    return prompt;
}

function formatConversationHistory(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return [];
    }

    return history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));
}

exports.sendMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        const userId = req.id;

        if(!message){
            return res.status(400).send({ message: "A non-empty message is required" });
        }

        const context = await userContext(userId);
        const systemPrompt = createSystemPrompt(context);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        const formattedHistory = formatConversationHistory(history);

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.send({
            response,
            timestamp: new Date().toISOString()
        });


    } catch (err) {
        console.error("Chat error:", err);

        if (err.message && err.message.includes('API key')) {
            return res.status(500).send({
                message: "AI service configuration error. Please contact support."
            });
        }

        res.status(500).send({
            message: "Failed to process your message. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};