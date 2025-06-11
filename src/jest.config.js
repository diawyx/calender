// jest.config.js
module.exports = {
  // ...konfigurasi Anda yang lain...

  // Perbarui bagian ini
  collectCoverageFrom: [
    // Sertakan semua file .js dan .jsx di dalam folder src
    "src/**/*.{js,jsx}", 
    
    // --- Pengecualian ---
    // Jangan sertakan file tes dalam laporan cakupan
    "!src/**/*.test.{js,jsx}",
    "!src/**/*.spec.{js,jsx}",
    
    // Jangan sertakan file setup atau file entry point utama
    "!src/index.js",
    "!src/reportWebVitals.js",
    "!src/setupTests.js",

    // Jangan sertakan folder yang mungkin tidak perlu diuji (jika ada)
    // Contoh: "!src/apis/**"
  ],

  // Pastikan properti lain tetap ada
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'html'],
};