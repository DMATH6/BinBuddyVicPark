const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const addressList = [];

// Helper to normalize addresses
function normalize(str) {
  return str.toString().toLowerCase().replace(/[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

// Load CSV
fs.createReadStream(path.join(__dirname, "ValidAddresses.csv"))
  .pipe(csv())
  .on("data", row => {
    const number = row.Number?.trim();
    const street = row.Street?.trim();
    const suburb = row.Suburb?.trim();
    const binGroup = row.BinGroup?.trim();

    if (!number || !street || !suburb || !binGroup) return;

    const fullAddress = `${number} ${street} ${suburb}`;
    addressList.push({
      original: fullAddress,
      normalized: normalize(fullAddress),
      binGroup
    });
  })
  .on("end", () => console.log("CSV loaded:", addressList.length, "addresses"))
  .on("error", console.error);

// Autocomplete API
app.get("/api/suggest", (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  const search = normalize(q);
  const suggestions = addressList
    .filter(addr => addr.normalized.includes(search))
    .slice(0, 5)
    .map(addr => ({ address: addr.original, binGroup: addr.binGroup }));

  res.json(suggestions);
});

// Exact match API
app.post("/api/echo", (req, res) => {
  const input = req.body.message;
  if (!input) return res.status(400).json({ error: "No address provided" });

  const found = addressList.some(addr => addr.normalized === normalize(input));
  res.json({ found });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontEnd"))); 

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
