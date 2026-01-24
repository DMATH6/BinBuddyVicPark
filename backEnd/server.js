const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/message", (req, res) => {
  res.json({ message: "BackEnd works!" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.post("/api/echo", (req, res) => {
  const message = req.body.message;

  console.log("Client sent:", message);

  res.json({
    received: message
  });
});
