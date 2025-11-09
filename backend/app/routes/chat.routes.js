const express = require('express');
const router = new express.Router();
const controller = require('../controllers/chat.controller');
const middleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/chatbot/send-message:
 *   post:
 *     summary: Send message to AI finance assistant
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Send a message to the AI chatbot and receive a response.
 *       The bot has context about your preferences, credit tier, saved quotes, and bookmarked vehicles.
 *       You can include conversation history to maintain context across messages.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *           examples:
 *             simpleQuestion:
 *               summary: Simple question
 *               value:
 *                 message: What is the difference between leasing and financing?
 *             withHistory:
 *               summary: Question with conversation history
 *               value:
 *                 message: What about lease terms?
 *                 history:
 *                   - role: user
 *                     content: What is leasing?
 *                   - role: assistant
 *                     content: Leasing is a way to use a vehicle...
 *     responses:
 *       200:
 *         description: Chat response successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error or AI service unavailable
 */
router.post("/send-message", middleware.verifyToken, controller.sendMessage);

module.exports = router;