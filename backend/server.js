const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const db = require("./app/models/index");

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());

const vehicleRoutes = require("./app/routes/vehicle.routes");
const authRoutes = require("./app/routes/auth.routes");

app.use('/api/vehicle', vehicleRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Toyotrack!" })
});

db.sequelize.authenticate();
app.listen(3000, () => {
    console.log(`server is running on port 3000.`);
});