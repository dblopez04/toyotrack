require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../models");

const JSON_DIR = path.join(__dirname, "../cars-data/json");
const IMG_DIR = path.join(__dirname, "../cars-data/img");

function extractAllTrims(vehicleData) {
  const trims = [];
  if (vehicleData.bestMatch) trims.push(vehicleData.bestMatch);
  if (Array.isArray(vehicleData.trimOptions)) trims.push(...vehicleData.trimOptions);
  return trims;
}

async function importVehicle(fileBase) {
  const jsonFile = path.join(JSON_DIR, `${fileBase}.json`);
  const imgFile = path.join(IMG_DIR, `${fileBase}.json`);

  if (!fs.existsSync(jsonFile)) return;

  const vehicleData = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const imageData = fs.existsSync(imgFile)
    ? JSON.parse(fs.readFileSync(imgFile, "utf8"))
    : { images: [] };

  const trims = extractAllTrims(vehicleData);
  if (trims.length === 0) return;

  // pick the first trim (most cars only have one)
  const trim = trims[0];

  const vehicle = await db.Vehicle.create({
    make: trim.make,
    model: trim.model,
    year: trim.year,
    trimName: trim.name,
    baseMsrp: trim.base_msrp,
    baseInvoice: trim.base_invoice,
    truck: trim.is_truck || false,
    electric: trim.is_electric || false,
    pluginElectric: trim.is_plugin_electric || false
  });

  // colors
  for (const color of trim.color?.exterior || []) {
    await db.ExteriorColor.create({
      vehicleId: vehicle.id,
      colorSchemeName: color.name,
      rgbValue: color.rgb
    });
  }

  for (const color of trim.color?.interior || []) {
    await db.InteriorColor.create({
      vehicleId: vehicle.id,
      colorSchemeName: color.name,
      rgbValue: color.rgb
    });
  }

  // features
  for (const cat of trim.features?.standard || []) {
    for (const f of cat.features) {
      await db.ExtraFeature.create({
        vehicleId: vehicle.id,
        category: cat.category,
        featureName: f.name,
        featureDescription: f.value || null,
        optional: false
      });
    }
  }

  for (const cat of trim.features?.optional || []) {
    for (const f of cat.features) {
      await db.ExtraFeature.create({
        vehicleId: vehicle.id,
        category: cat.category,
        featureName: f.name,
        featureDescription: f.price ? f.price.toString() : null,
        optional: true
      });
    }
  }

  // images
  for (const img of imageData.images || []) {
    await db.CarImage.create({
      vehicleId: vehicle.id,
      imageHeight: img.height || null,
      imageWidth: img.width || null,
      imageUrl: img.link
    });
  }

  console.log(`Imported ${trim.make} ${trim.model} (${trim.year})`);
}

(async () => {
  await db.sequelize.sync({ force: true });
  const files = fs.readdirSync(JSON_DIR)
    .filter(f => f.endsWith(".json"))
    .map(f => path.basename(f, ".json"));

  for (const fileBase of files) {
    try {
      await importVehicle(fileBase);
    } catch (err) {
      console.error(`Failed to import ${fileBase}:`, err.message);
    }
  }

  console.log("All imports complete!");
  process.exit(0);
})();