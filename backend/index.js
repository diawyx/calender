const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ fileUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

app.listen(5000, () => console.log("Backend jalan di http://localhost:5000"));
