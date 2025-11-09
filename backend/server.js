const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./app/models/index");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./app/config/swagger');

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'], // Common Vite/React dev ports
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const vehicleRoutes = require("./app/routes/vehicle.routes");
const authRoutes = require("./app/routes/auth.routes");
const financeRoutes = require("./app/routes/finance.routes");
const userRoutes = require("./app/routes/user.routes");
const chatbotRoutes = require("./app/routes/chat.routes")

app.use('/api/vehicle', vehicleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chatbot', chatbotRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Toyotrack!",
        documentation: "Visit /api-docs for API documentation"
    })
});

db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
        return db.sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Database tables synchronized.');
        app.listen(4000, () => {
            console.log(`server is running on port 4000.`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });