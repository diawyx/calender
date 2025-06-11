module.exports = {
  // Konfigurasi Jest Anda yang sudah ada...

  // -- TAMBAHKAN BAGIAN INI --
  // Aktifkan pengumpulan data cakupan
  collectCoverage: true,

  // Tentukan folder output untuk laporan
  coverageDirectory: 'coverage',

  // Tentukan format laporan. 'lcov' sangat penting untuk SonarQube.
  coverageReporters: ['lcov', 'text', 'html'],

  // Tentukan file mana yang akan dimasukkan dalam laporan cakupan.
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}', // Mencakup semua file di dalam folder src
    '!src/index.js',            // Kecualikan file index utama
    '!src/reportWebVitals.js',  // Kecualikan file lain yang tidak perlu diuji
    '!src/**/*.test.{js,jsx}',  // Kecualikan semua file tes
    '!src/store/**'             // Contoh: Kecualikan folder store jika tidak diuji unit
  ],
};