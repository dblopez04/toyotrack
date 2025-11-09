const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const db = require("./app/models/index");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./app/config/swagger');

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

db.sequelize.authenticate();
app.listen(3000, () => {
    console.log(`server is running on port 3000.`);
});