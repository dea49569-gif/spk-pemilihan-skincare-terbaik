/**
 * alternatifController.js
 * ------------------------
 * CRUD untuk data Alternatif (produk skincare)
 * dan juga mengurus update NILAI saat alternatif ditambah/dihapus
 */

const AlternatifController = (() => {

  // ── READ: Ambil semua alternatif ────────────────────────────────────────────
  function getAll() {
    return [...ALTERNATIF];
  }

  // ── READ: Ambil satu alternatif berdasarkan kode ────────────────────────────
  function getByKode(kode) {
    return ALTERNATIF.find((a) => a.kode === kode) || null;
  }

  // ── CREATE: Tambah alternatif baru ──────────────────────────────────────────
  function create(data, nilaiArr) {
    // Validasi kode tidak duplikat
    if (ALTERNATIF.some((a) => a.kode === data.kode)) {
      return { success: false, message: `Kode ${data.kode} sudah digunakan!` };
    }

    // Validasi nama tidak kosong
    if (!data.nama || data.nama.trim() === "") {
      return { success: false, message: "Nama produk tidak boleh kosong!" };
    }

    // Validasi harga
    const harga = parseInt(data.harga);
    if (isNaN(harga) || harga <= 0) {
      return { success: false, message: "Harga harus berupa angka positif!" };
    }

    // Validasi nilaiArr: harus ada nilai untuk setiap kriteria
    if (!Array.isArray(nilaiArr) || nilaiArr.length !== KRITERIA.length) {
      return {
        success: false,
        message: `Nilai harus diisi untuk semua ${KRITERIA.length} kriteria!`,
      };
    }

    const nilaiParsed = nilaiArr.map(Number);
    if (nilaiParsed.some(isNaN)) {
      return { success: false, message: "Semua nilai kriteria harus berupa angka!" };
    }

    // Auto-generate kode jika tidak diisi
    const kodeBaru = data.kode || `A${ALTERNATIF.length + 1}`;

    const altBaru = {
      kode: kodeBaru,
      nama: data.nama.trim(),
      brand: data.brand || "-",
      jenis: data.jenis || "Serum",
      harga: harga,
    };

    ALTERNATIF.push(altBaru);
    NILAI.push(nilaiParsed);

    return { success: true, message: "Alternatif berhasil ditambahkan!", data: altBaru };
  }

  // ── UPDATE: Edit alternatif yang ada ───────────────────────────────────────
  function update(kode, dataUpdate, nilaiArr) {
    const idx = ALTERNATIF.findIndex((a) => a.kode === kode);
    if (idx === -1) {
      return { success: false, message: `Alternatif ${kode} tidak ditemukan.` };
    }

    const harga = parseInt(dataUpdate.harga);
    if (isNaN(harga) || harga <= 0) {
      return { success: false, message: "Harga harus angka positif!" };
    }

    // Update data alternatif
    ALTERNATIF[idx] = {
      ...ALTERNATIF[idx],
      nama: dataUpdate.nama || ALTERNATIF[idx].nama,
      brand: dataUpdate.brand || ALTERNATIF[idx].brand,
      jenis: dataUpdate.jenis || ALTERNATIF[idx].jenis,
      harga: harga,
    };

    // Update nilai jika dikirim
    if (Array.isArray(nilaiArr) && nilaiArr.length === KRITERIA.length) {
      const nilaiParsed = nilaiArr.map(Number);
      if (!nilaiParsed.some(isNaN)) {
        NILAI[idx] = nilaiParsed;
      }
    }

    return { success: true, message: "Alternatif berhasil diperbarui!", data: ALTERNATIF[idx] };
  }

  // ── DELETE: Hapus alternatif ────────────────────────────────────────────────
  function remove(kode) {
    const idx = ALTERNATIF.findIndex((a) => a.kode === kode);
    if (idx === -1) {
      return { success: false, message: `Alternatif ${kode} tidak ditemukan.` };
    }

    if (ALTERNATIF.length <= 2) {
      return { success: false, message: "Minimal harus ada 2 alternatif untuk perbandingan SAW." };
    }

    ALTERNATIF.splice(idx, 1);
    NILAI.splice(idx, 1);

    return { success: true, message: `Alternatif ${kode} berhasil dihapus.` };
  }

  return { getAll, getByKode, create, update, remove };
})();
