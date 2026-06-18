/**
 * database.js
 * -----------
 * Data hardcode untuk SPK Pemilihan Skincare Terbaik
 * Berisi: KRITERIA, ALTERNATIF, NILAI (Matriks Keputusan)
 *
 * Catatan:
 * - File ini berfungsi sebagai "database" simulasi
 * - Di project nyata, data ini bisa diganti dengan fetch() ke REST API / MySQL
 */

// ─────────────────────────────────────────────────────────────────────────────
// KRITERIA
// Setiap kriteria punya: kode, nama, bobot (0–1), jenis (benefit/cost), keterangan
// Total bobot harus = 1.00 (100%)
// ─────────────────────────────────────────────────────────────────────────────
const KRITERIA = [
  {
    kode: "C1",
    nama: "Harga (Rp)",
    bobot: 0.25,
    jenis: "cost",       // cost = semakin kecil semakin baik
    keterangan: "Harga per produk (semakin murah semakin baik)",
  },
  {
    kode: "C2",
    nama: "Efektivitas (Skor 1–10)",
    bobot: 0.20,
    jenis: "benefit",    // benefit = semakin besar semakin baik
    keterangan: "Tingkat efektivitas produk berdasarkan review",
  },
  {
    kode: "C3",
    nama: "Kandungan Bahan Aktif",
    bobot: 0.20,
    jenis: "benefit",
    keterangan: "Jumlah bahan aktif bermanfaat dalam produk",
  },
  {
    kode: "C4",
    nama: "Rating Konsumen (1–10)",
    bobot: 0.15,
    jenis: "benefit",
    keterangan: "Rating rata-rata oleh konsumen di marketplace",
  },
  {
    kode: "C5",
    nama: "Keamanan (BPOM Terverif.)",
    bobot: 0.12,
    jenis: "benefit",
    keterangan: "Skor keamanan berdasarkan sertifikasi BPOM",
  },
  {
    kode: "C6",
    nama: "Ketersediaan (Kemudahan)",
    bobot: 0.08,
    jenis: "benefit",
    keterangan: "Kemudahan mendapatkan produk (skor 1–10)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ALTERNATIF
// 15 produk skincare yang jadi kandidat pilihan
// ─────────────────────────────────────────────────────────────────────────────
const ALTERNATIF = [
  { kode: "A1",  nama: "Somethinc Niacinamide Serum",  brand: "Somethinc",    jenis: "Serum",     harga: 89000  },
  { kode: "A2",  nama: "Wardah White Secret Serum",    brand: "Wardah",       jenis: "Serum",     harga: 75000  },
  { kode: "A3",  nama: "COSRX Snail Mucin Essence",    brand: "COSRX",        jenis: "Essence",   harga: 250000 },
  { kode: "A4",  nama: "Emina Sun Protection SPF 30",  brand: "Emina",        jenis: "Sunscreen", harga: 35000  },
  { kode: "A5",  nama: "The Ordinary Niacinamide 10%", brand: "The Ordinary", jenis: "Serum",     harga: 210000 },
  { kode: "A6",  nama: "Azarine Hydrasoothe SPF 45",   brand: "Azarine",      jenis: "Sunscreen", harga: 55000  },
  { kode: "A7",  nama: "Skintific 5X Ceramide Serum",  brand: "Skintific",    jenis: "Serum",     harga: 130000 },
  { kode: "A8",  nama: "Hanasui Brightening Serum",    brand: "Hanasui",      jenis: "Serum",     harga: 25000  },
  { kode: "A9",  nama: "Scarlett Brightly Serum",      brand: "Scarlett",     jenis: "Serum",     harga: 95000  },
  { kode: "A10", nama: "Bioré UV Aqua Rich Watery",    brand: "Bioré",        jenis: "Sunscreen", harga: 195000 },
  { kode: "A11", nama: "Avoskin Your Skin Bae HA",     brand: "Avoskin",      jenis: "Toner",     harga: 148000 },
  { kode: "A12", nama: "Dear Me Beauty Barrier Serum", brand: "Dear Me",      jenis: "Serum",     harga: 110000 },
  { kode: "A13", nama: "Erha Acne Spot Gel",           brand: "Erha",         jenis: "Treatment", harga: 79000  },
  { kode: "A14", nama: "Y.O.U Sunwhite Perfect UV",    brand: "Y.O.U",        jenis: "Sunscreen", harga: 49000  },
  { kode: "A15", nama: "Implora Mugwort Soothing",     brand: "Implora",      jenis: "Serum",     harga: 29000  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NILAI (Matriks Keputusan)
// Urutan kolom: [C1=Harga, C2=Efektivitas, C3=Kandungan, C4=Rating, C5=Keamanan, C6=Ketersediaan]
// Urutan baris: A1 sampai A15 (sesuai ALTERNATIF di atas)
// ─────────────────────────────────────────────────────────────────────────────
const NILAI = [
  //  C1       C2    C3    C4    C5    C6
  [ 89000,   8.5,   7,   8.6,   9,    9  ], // A1  Somethinc
  [ 75000,   7.5,   5,   8.2,   9,    9  ], // A2  Wardah
  [250000,   9.2,   9,   9.0,  10,    7  ], // A3  COSRX
  [ 35000,   6.8,   4,   7.9,   9,    9  ], // A4  Emina
  [210000,   9.0,   8,   8.8,  10,    8  ], // A5  The Ordinary
  [ 55000,   8.0,   6,   8.7,   9,   10  ], // A6  Azarine
  [130000,   8.7,   8,   8.9,   9,    8  ], // A7  Skintific
  [ 25000,   6.0,   3,   7.2,   8,    9  ], // A8  Hanasui
  [ 95000,   8.2,   6,   8.4,   9,    9  ], // A9  Scarlett
  [195000,   9.1,   7,   8.6,  10,    7  ], // A10 Bioré
  [148000,   8.8,   9,   8.7,   9,    7  ], // A11 Avoskin
  [110000,   8.3,   7,   8.5,   9,    8  ], // A12 Dear Me
  [ 79000,   7.8,   5,   7.8,   9,    8  ], // A13 Erha
  [ 49000,   7.2,   5,   8.0,   9,   10  ], // A14 Y.O.U
  [ 29000,   6.5,   4,   7.5,   8,    8  ], // A15 Implora
];

// Export agar bisa dipakai di file lain (simulasi module)
// Kalau pakai Node.js: module.exports = { KRITERIA, ALTERNATIF, NILAI };
// Kalau pakai browser langsung, variabel ini sudah global karena dimuat via <script>
