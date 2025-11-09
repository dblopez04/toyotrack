const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ToyoTrack API Documentation',
    version: '1.0.0',
    description: `
      ToyoTrack is a comprehensive Toyota vehicle financing and management platform.

      ## Features
      - User authentication and profile management
      - Vehicle browsing and bookmarking
      - Finance and lease payment calculations
      - AI-powered chat assistant for financing questions
      - Quote management for saving financing scenarios

      ## Authentication
      Most endpoints require JWT authentication via Bearer token.
      Use the /api/auth/login endpoint to obtain a token.
    `,
    contact: {
      name: 'ToyoTrack Support',
      email: 'support@toyotrack.com'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          email: { type: 'string', format: 'email' },
          completedOnboarding: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UserPreferences: {
        type: 'object',
        properties: {
          budget: { type: 'number', example: 30000 },
          carType: { type: 'string', example: 'sedan' },
          purchaseType: { type: 'string', enum: ['finance', 'lease'] },
        },
      },
      UserFinance: {
        type: 'object',
        properties: {
          creditTier: {
            type: 'string',
            enum: ['excellent', 'good', 'fair', 'poor'],
          },
        },
      },
      CreditTier: {
        type: 'object',
        properties: {
          tier: { type: 'string' },
          apr: { type: 'number' },
          aprPercent: { type: 'string' },
        },
      },
      FinanceCalculation: {
        type: 'object',
        properties: {
          price: { type: 'number', example: 30000 },
          downPayment: { type: 'number', example: 5000 },
          termMonths: { type: 'integer', enum: [24, 36, 48, 60, 72] },
          creditTier: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'] },
          purchaseType: { type: 'string', enum: ['finance', 'lease'] },
        },
        required: ['price', 'termMonths', 'creditTier', 'purchaseType'],
      },
      FinanceResult: {
        type: 'object',
        properties: {
          purchaseType: { type: 'string' },
          monthlyPayment: { type: 'number' },
          termMonths: { type: 'integer' },
          downPayment: { type: 'number' },
          dueAtSigning: { type: 'number' },
          apr: { type: 'number' },
          creditTier: { type: 'string' },
          totalCost: { type: 'number' },
          totalInterest: { type: 'number' },
          amountFinanced: { type: 'number' },
        },
      },
      LeaseResult: {
        type: 'object',
        properties: {
          purchaseType: { type: 'string' },
          monthlyPayment: { type: 'number' },
          termMonths: { type: 'integer' },
          downPayment: { type: 'number' },
          dueAtSigning: { type: 'number' },
          apr: { type: 'number' },
          creditTier: { type: 'string' },
          residualValue: { type: 'number' },
          acquisitionFee: { type: 'number' },
          depreciationMonthly: { type: 'number' },
          financeMonthly: { type: 'number' },
        },
      },
      VehicleQuote: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          vehicleId: { type: 'integer' },
          termLengthMonths: { type: 'integer' },
          apr: { type: 'number' },
          downPayment: { type: 'number' },
          estimatedPayment: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ChatMessage: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'What is the difference between leasing and financing?' },
          history: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['user', 'assistant'] },
                content: { type: 'string' },
              },
            },
          },
        },
        required: ['message'],
      },
      ChatResponse: {
        type: 'object',
        properties: {
          response: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  tags: [
    { name: 'Authentication', description: 'User authentication endpoints' },
    { name: 'User', description: 'User profile and preferences management' },
    { name: 'Finance', description: 'Finance calculations and quote management' },
    { name: 'Chat', description: 'AI chat assistant for financing questions' },
    { name: 'Vehicles', description: 'Vehicle browsing and information' },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./app/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
