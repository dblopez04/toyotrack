const { GoogleGenAI } = require("@google/genai");
const db = require("../models");
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
        console.error('Error getting user context:', err);
        return null;
    }
}

function createSystemPrompt(userContext) {
    let prompt = `You are ToyoTrack's AI finance assistant for Toyota vehicles.

    Keep responses SHORT (2-4 sentences max). Be direct and helpful.

    Key Info:
    - Credit Tiers: Excellent (4.9%), Good (6.9%), Fair (9.9%), Poor (14.9%)
    - Finance: 24-72 months | Lease: 24-48 months
    - Finance = you own it, higher payments | Lease = lower payments, mileage limits

    Guidelines:
    - Answer the question directly, skip fluff
    - There is no text formatting in our chat site so please just use plaintext.
    - Keep it simple and conversational`;

    if (userContext) {
        prompt += `\n\nUser: ${userContext}`;
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

        // Build the full prompt with system instruction and history
        let fullPrompt = systemPrompt + "\n\n";

        // Add conversation history
        if (history && history.length > 0) {
            fullPrompt += "Conversation History:\n";
            history.forEach(msg => {
                fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
            });
            fullPrompt += "\n";
        }

        fullPrompt += `User: ${message}\nAssistant:`;

        const result = await genAI.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: fullPrompt,
        });

        const response = result.text;

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