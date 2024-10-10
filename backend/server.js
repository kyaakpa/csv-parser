const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { error, log } = require("console");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/upload-csv", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "no file uploaded" });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      fs.unlinkSync(req.file.path);
      res.json(results);
    });
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
