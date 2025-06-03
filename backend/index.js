const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ambil port dari environment variable PORT, atau gunakan 5000 jika tidak disetel (untuk lokal)
// Cloud Run akan otomatis menyetel process.env.PORT (biasanya ke 8080)
const PORT = process.env.PORT || 5000; // Anda bisa ganti 5000 dengan port default lokal lain jika mau

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  // PENTING: URL file ini perlu disesuaikan agar dinamis saat di-deploy.
  // Untuk sekarang, kita fokus pada port listening.
  // Cara ideal adalah membuat URL ini relatif atau menggunakan environment variable untuk base URL.
  // Contoh sementara (mungkin perlu penyesuaian lebih lanjut tergantung setup frontend & backend URL Anda):
  const baseUrl = req.protocol + '://' + req.get('host'); // Mencoba mendapatkan base URL dinamis
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  // Jika di atas tidak bekerja dengan baik di semua environment, alternatifnya adalah frontend
  // yang tahu base URL backend dan hanya menerima path relatif: `/uploads/${req.file.filename}`
  // atau Anda set BASE_BACKEND_URL sebagai environment variable.
  // Untuk Cloud Run, Anda mungkin ingin mengembalikan path relatif saja:
  // const fileUrl = `/uploads/${req.file.filename}`;
  // atau jika frontend dan backend di domain yang sama:
  // const fileUrl = `/uploads/${req.file.filename}`;
  // Untuk sekarang, kita biarkan seperti ini dulu agar fokus ke port, tapi ini area penting untuk diperhatikan.
  // Untuk production, hardcoding 'http://localhost:5000' pasti tidak akan bekerja.
  // Mari kita coba buat lebih dinamis, tapi ini mungkin butuh penyesuaian lebih lanjut:
  // const deployedBaseUrl = process.env.BACKEND_BASE_URL || `http://localhost:${PORT}`;
  // const fileUrl = `${deployedBaseUrl}/uploads/${req.file.filename}`;
  // Untuk Cloud Run, yang paling aman adalah mengembalikan path relatif jika frontend bisa menanganinya
  // atau jika frontend dan backend berada di domain yang sama.
  // Jika frontend dan backend terpisah, frontend perlu tahu URL backend.

  // Solusi paling sederhana untuk sekarang, dengan asumsi frontend akan menggabungkannya dengan URL backend yang benar:
  const relativeFileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl: relativeFileUrl, message: "File uploaded successfully. URL is relative." });

  // Jika Anda ingin tetap mengirimkan URL absolut dan mengharapkan backend ini diakses langsung:
  // (Ini akan bekerja jika BACKEND_BASE_URL diset di environment Cloud Run Anda ke URL publiknya)
  // const absoluteFileUrl = `${process.env.BACKEND_BASE_URL || `http://localhost:${PORT}`}/uploads/${req.file.filename}`;
  // res.json({ fileUrl: absoluteFileUrl });
});

// Modifikasi bagian app.listen()
// Pastikan mendengarkan di host '0.0.0.0' dan port yang sudah ditentukan
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend berjalan dan mendengarkan di port ${PORT}`);
  console.log(`Akses di http://0.0.0.0:${PORT} atau http://localhost:${PORT} (untuk lokal)`);
});
