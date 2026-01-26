const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const addressList = []; // store addresses for autocomplete

// ---------- Normalize helper ----------
function normalize(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

// ---------- Load CSV ----------
function loadCSV() {
  const filePath = path.join(__dirname, "ValidAddresses.csv");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
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
    .on("end", () => {
      console.log("CSV loaded:", addressList.length, "addresses");
    })
    .on("error", console.error);
}

// Load CSV once on startup
loadCSV();

// ---------- Routes ----------

// Exact match check
app.post("/api/echo", (req, res) => {
  const input = req.body.message;
  if (!input) return res.status(400).json({ error: "No address provided" });

  const found = addressList.some(addr => addr.normalized === normalize(input));
  res.json({ found });
});

// Autocomplete endpoint
app.get("/api/suggest", (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  const search = normalize(q);

  const suggestions = addressList
    .filter(addr => addr.normalized.includes(search)) // match anywhere
    .slice(0, 5) // top 5 suggestions
    .map(addr => ({
      address: addr.original,
      binGroup: addr.binGroup
    }));

  res.json(suggestions);
});

// ---------- Start server ----------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
