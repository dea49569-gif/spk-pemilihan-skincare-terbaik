# 🌸 SPK Pemilihan Skincare Terbaik — Metode SAW

> Tugas Akhir Mata Kuliah Sistem Pendukung Keputusan  
> Metode: Simple Additive Weighting (SAW)  
> Studi Kasus: Pemilihan Produk Skincare Terbaik

---

## 📁 Struktur Folder

```
spk-skincare-saw/
├── frontend/
│   ├── index.html              ← Entry point (layout + nav)
│   ├── css/
│   │   └── style.css           ← Semua styling
│   ├── js/
│   │   ├── app.js              ← Router & init
│   │   ├── saw.js              ← Logika SAW (normalisasi + perhitungan)
│   │   └── pages/
│   │       ├── beranda.js      ← Render halaman Beranda
│   │       ├── kriteria.js     ← Render + CRUD Kriteria
│   │       ├── alternatif.js   ← Render + CRUD Alternatif
│   │       ├── nilai.js        ← Render Matriks Nilai
│   │       ├── normalisasi.js  ← Render Normalisasi
│   │       ├── perhitungan.js  ← Render Perhitungan Vi
│   │       └── hasil.js        ← Render Hasil & Ranking
│   └── pages/                  ← (opsional) HTML per halaman jika dipisah
│
├── backend/
│   ├── data/
│   │   └── database.js         ← Data hardcode (KRITERIA, ALTERNATIF, NILAI)
│   ├── controllers/
│   │   ├── kriteriaController.js   ← CRUD logic Kriteria
│   │   └── alternatifController.js ← CRUD logic Alternatif
│   └── routes/
│       └── api.js              ← Simulasi REST API endpoint
│
└── docs/
    └── penjelasan-saw.md       ← Dokumentasi metode SAW
```

---

## 🚀 Cara Menjalankan

1. Clone repository ini:
   ```bash
   git clone https://github.com/username/spk-skincare-saw.git
   ```

2. Masuk ke folder project:
   ```bash
   cd spk-skincare-saw
   ```

3. Buka file `frontend/index.html` di browser (tidak perlu server).

   > Atau gunakan **Live Server** di VS Code supaya lebih nyaman.

---

## 📐 Tentang Metode SAW

**Simple Additive Weighting (SAW)** adalah metode pengambilan keputusan multi-kriteria yang bekerja dengan cara:

1. **Normalisasi Matriks** — Mengubah nilai setiap alternatif ke skala 0–1
   - Kriteria Benefit: `r_ij = x_ij / Max(x_ij)`
   - Kriteria Cost: `r_ij = Min(x_ij) / x_ij`

2. **Nilai Preferensi** — Menjumlah hasil perkalian bobot × nilai ternormalisasi
   - `V_i = Σ (w_j × r_ij)`

3. **Ranking** — Alternatif dengan nilai V terbesar adalah yang terbaik.

---

## 📊 Data yang Digunakan

- **15 Alternatif** produk skincare lokal dan internasional
- **6 Kriteria**: Harga, Efektivitas, Kandungan Bahan Aktif, Rating, Keamanan BPOM, Ketersediaan

---

## ✨ Fitur CRUD

| Fitur | Keterangan |
|-------|-----------|
| ➕ Tambah Kriteria | Form tambah kriteria baru dengan bobot & jenis |
| ✏️ Edit Kriteria | Ubah nama, bobot, atau jenis kriteria |
| 🗑️ Hapus Kriteria | Hapus kriteria (dengan konfirmasi) |
| ➕ Tambah Alternatif | Form tambah produk skincare baru |
| ✏️ Edit Alternatif | Ubah data produk |
| 🗑️ Hapus Alternatif | Hapus produk dari daftar |
| 🔄 Recalculate | Hasil ranking otomatis update setelah ada perubahan data |

---

## 👥 Anggota Kelompok

| Nama | NIM |
|------|-----|
| (isi nama) | (isi NIM) |
| (isi nama) | (isi NIM) |

---

> Dibuat sebagai Tugas Final — Sistem Pendukung Keputusan
