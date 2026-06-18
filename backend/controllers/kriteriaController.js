/**
 * kriteriaController.js
 * ----------------------
 * Berisi fungsi-fungsi CRUD untuk data Kriteria
 * Create, Read, Update, Delete
 *
 * Karena ini project frontend-only (tidak pakai server),
 * "database" disimpan di memori (variabel global KRITERIA).
 * Di project real: ganti fetch() ke backend/API.
 */

const KriteriaController = (() => {

  // ── READ: Ambil semua kriteria ──────────────────────────────────────────────
  function getAll() {
    // return salinan array supaya data asli tidak langsung diubah dari luar
    return [...KRITERIA];
  }

  // ── READ: Ambil satu kriteria berdasarkan kode ──────────────────────────────
  function getByKode(kode) {
    return KRITERIA.find((k) => k.kode === kode) || null;
  }

  // ── CREATE: Tambah kriteria baru ────────────────────────────────────────────
  function create(data) {
    // Validasi: kode tidak boleh duplikat
    if (KRITERIA.some((k) => k.kode === data.kode)) {
      return { success: false, message: `Kode ${data.kode} sudah ada!` };
    }

    // Validasi: bobot harus angka antara 0–1
    const bobot = parseFloat(data.bobot);
    if (isNaN(bobot) || bobot <= 0 || bobot > 1) {
      return { success: false, message: "Bobot harus antara 0 dan 1 (contoh: 0.20)" };
    }

    // Validasi: jenis harus benefit atau cost
    if (!["benefit", "cost"].includes(data.jenis)) {
      return { success: false, message: "Jenis harus 'benefit' atau 'cost'" };
    }

    const kriteriaBaru = {
      kode: data.kode.toUpperCase(),
      nama: data.nama,
      bobot: bobot,
      jenis: data.jenis,
      keterangan: data.keterangan || "",
    };

    KRITERIA.push(kriteriaBaru);

    // Tambah kolom nilai 0 untuk semua alternatif yang sudah ada
    NILAI.forEach((row) => row.push(0));

    return { success: true, message: "Kriteria berhasil ditambahkan!", data: kriteriaBaru };
  }

  // ── UPDATE: Edit kriteria yang sudah ada ────────────────────────────────────
  function update(kode, dataUpdate) {
    const idx = KRITERIA.findIndex((k) => k.kode === kode);
    if (idx === -1) {
      return { success: false, message: `Kriteria dengan kode ${kode} tidak ditemukan.` };
    }

    const bobot = parseFloat(dataUpdate.bobot);
    if (isNaN(bobot) || bobot <= 0 || bobot > 1) {
      return { success: false, message: "Bobot harus antara 0 dan 1" };
    }

    // Update data (kode tidak boleh diubah karena jadi ID)
    KRITERIA[idx] = {
      ...KRITERIA[idx],
      nama: dataUpdate.nama || KRITERIA[idx].nama,
      bobot: bobot,
      jenis: dataUpdate.jenis || KRITERIA[idx].jenis,
      keterangan: dataUpdate.keterangan ?? KRITERIA[idx].keterangan,
    };

    return { success: true, message: "Kriteria berhasil diperbarui!", data: KRITERIA[idx] };
  }

  // ── DELETE: Hapus kriteria berdasarkan kode ─────────────────────────────────
  function remove(kode) {
    const idx = KRITERIA.findIndex((k) => k.kode === kode);
    if (idx === -1) {
      return { success: false, message: `Kriteria ${kode} tidak ditemukan.` };
    }

    // Minimal harus ada 1 kriteria
    if (KRITERIA.length <= 1) {
      return { success: false, message: "Tidak bisa menghapus, minimal harus ada 1 kriteria." };
    }

    // Hapus dari array kriteria
    KRITERIA.splice(idx, 1);

    // Hapus kolom nilai yang bersangkutan dari semua baris NILAI
    NILAI.forEach((row) => row.splice(idx, 1));

    return { success: true, message: `Kriteria ${kode} berhasil dihapus.` };
  }

  // ── UTIL: Hitung total bobot (harusnya = 1.00) ──────────────────────────────
  function totalBobot() {
    return KRITERIA.reduce((sum, k) => sum + k.bobot, 0);
  }

  // Expose fungsi yang boleh dipakai dari luar
  return { getAll, getByKode, create, update, remove, totalBobot };
})();
