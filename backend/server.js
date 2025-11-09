const express = require("express");
const app = express();
const db = require("./app/models/index");

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const vehicleRoutes = require("./app/routes/vehicle.routes");
app.use('/api/vehicle', vehicleRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Toyotrack!" })
});

db.sequelize.authenticate();
app.listen(3000, () => {
    console.log(`server is running on port 3000.`);
});