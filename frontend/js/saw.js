/**
 * saw.js
 * -------
 * Semua logika matematis metode SAW ada di sini:
 * 1. Normalisasi matriks keputusan
 * 2. Perhitungan nilai preferensi (Vi)
 * 3. Pengurutan hasil ranking
 *
 * File ini TIDAK mengurus tampilan (UI) sama sekali.
 * Biar mudah di-debug dan di-test secara mandiri.
 */

const SAW = (() => {

  /**
   * Ambil nilai satu kolom (satu kriteria) dari semua alternatif
   * @param {number} kolomIdx - index kolom (0 = C1, 1 = C2, dst)
   * @returns {number[]}
   */
  function ambilKolom(kolomIdx) {
    return NILAI.map((baris) => baris[kolomIdx]);
  }

  /**
   * Normalisasi satu nilai r_ij
   * Benefit: x_ij / max(x_j)
   * Cost   : min(x_j) / x_ij
   *
   * @param {number} nilai    - nilai alternatif
   * @param {number} max      - nilai max di kolom itu
   * @param {number} min      - nilai min di kolom itu
   * @param {string} jenis    - 'benefit' atau 'cost'
   * @returns {number}
   */
  function normalisasiSatu(nilai, max, min, jenis) {
    if (jenis === "benefit") {
      return nilai / max;
    } else {
      // cost: semakin kecil semakin baik → dibalik
      return min / nilai;
    }
  }

  /**
   * Normalisasi seluruh matriks keputusan
   * Menghasilkan matriks R (ternormalisasi)
   *
   * @returns {number[][]} matriks R ukuran [alternatif x kriteria]
   */
  function normalisasiMatriks() {
    const R = [];

    for (let i = 0; i < ALTERNATIF.length; i++) {
      R[i] = [];

      for (let j = 0; j < KRITERIA.length; j++) {
        const kolomNilai = ambilKolom(j);
        const max = Math.max(...kolomNilai);
        const min = Math.min(...kolomNilai);

        R[i][j] = normalisasiSatu(NILAI[i][j], max, min, KRITERIA[j].jenis);
      }
    }

    return R;
  }

  /**
   * Hitung nilai preferensi Vi untuk semua alternatif
   * Vi = Σ (wj × rij)
   *
   * @param {number[][]} R - matriks ternormalisasi
   * @returns {number[]} array nilai Vi, satu per alternatif
   */
  function hitungPreferensi(R) {
    return R.map((baris) => {
      return baris.reduce((jumlah, rij, j) => {
        return jumlah + KRITERIA[j].bobot * rij;
      }, 0);
    });
  }

  /**
   * Jalankan seluruh proses SAW dan kembalikan hasil ranking
   *
   * @returns {{alternatif, R, V, ranking}[]} array hasil terurut dari terbaik
   */
  function hitungSemua() {
    const R = normalisasiMatriks();
    const V = hitungPreferensi(R);

    // Buat array hasil gabungan lalu urutkan dari nilai terbesar
    const hasil = ALTERNATIF.map((alt, i) => ({
      rank: 0,                  // diisi setelah sorting
      alternatif: alt,
      nilaiAwal: [...NILAI[i]], // salin nilai asli
      nilaiNorm: [...R[i]],     // salin nilai ternormalisasi
      vi: V[i],
    }));

    hasil.sort((a, b) => b.vi - a.vi);

    // Tambahkan nomor ranking
    hasil.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    return hasil;
  }

  /**
   * Helper: format angka desimal
   * @param {number} n
   * @param {number} desimal - default 4
   */
  function fmt(n, desimal = 4) {
    return typeof n === "number" ? n.toFixed(desimal) : n;
  }

  /**
   * Helper: format harga rupiah
   * @param {number} n
   */
  function fmtHarga(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  // Expose fungsi yang dibutuhkan halaman lain
  return {
    normalisasiMatriks,
    hitungPreferensi,
    hitungSemua,
    ambilKolom,
    fmt,
    fmtHarga,
  };
})();
