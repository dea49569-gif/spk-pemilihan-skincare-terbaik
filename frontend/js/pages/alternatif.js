/**
 * pages/alternatif.js
 * --------------------
 * Render halaman Alternatif + form CRUD produk skincare
 *
 * Fitur:
 * - Tabel semua produk skincare
 * - Form tambah produk baru (termasuk isi nilai per kriteria)
 * - Edit produk
 * - Hapus produk
 */

const PageAlternatif = (() => {

  // ── RENDER UTAMA ──────────────────────────────────────────────────────────
  function render() {
    renderTabel();
    renderFormNilai(); // render input nilai sesuai jumlah kriteria saat ini
  }

  // ── TABEL ALTERNATIF ──────────────────────────────────────────────────────
  function renderTabel() {
    const tabel = document.getElementById("tbl-alternatif");
    if (!tabel) return;

    let html = `
      <thead>
        <tr>
          <th>Kode</th>
          <th>Nama Produk</th>
          <th>Brand</th>
          <th>Jenis</th>
          <th>Harga (C1)</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
    `;

    ALTERNATIF.forEach((a) => {
      html += `
        <tr>
          <td><strong>${a.kode}</strong></td>
          <td>${a.nama}</td>
          <td>${a.brand}</td>
          <td>
            <span style="background:var(--soft);border-radius:8px;padding:.15rem .6rem;font-size:.75rem">
              ${a.jenis}
            </span>
          </td>
          <td class="highlight">${SAW.fmtHarga(a.harga)}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="PageAlternatif.isiFormEdit('${a.kode}')">✏️ Edit</button>
            <button class="btn btn-sm btn-danger"    onclick="PageAlternatif.hapus('${a.kode}')">🗑️</button>
          </td>
        </tr>
      `;
    });

    html += "</tbody>";
    tabel.innerHTML = html;
  }

  // ── RENDER INPUT NILAI PER KRITERIA ───────────────────────────────────────
  // (dinamis sesuai jumlah kriteria yang ada)
  function renderFormNilai() {
    const wrapper = document.getElementById("form-nilai-kriteria");
    if (!wrapper) return;

    wrapper.innerHTML = "";

    KRITERIA.forEach((k, idx) => {
      // C1 = Harga sudah diurus di form utama, skip (ditangani lewat input harga)
      // Tetap tampilkan semua supaya fleksibel
      const labelHint = k.jenis === "cost" ? "(semakin kecil = lebih baik)" : "(semakin besar = lebih baik)";
      wrapper.innerHTML += `
        <div class="form-group">
          <label>${k.kode} — ${k.nama} <span style="color:var(--muted);font-weight:400">${labelHint}</span></label>
          <input type="number" id="input-nilai-${idx}" placeholder="contoh: 8.5" step="0.1" />
        </div>
      `;
    });
  }

  // ── ISI FORM UNTUK EDIT ───────────────────────────────────────────────────
  function isiFormEdit(kode) {
    const idx = ALTERNATIF.findIndex((a) => a.kode === kode);
    if (idx === -1) return;

    const a = ALTERNATIF[idx];

    document.getElementById("input-kode-a").value  = a.kode;
    document.getElementById("input-nama-a").value  = a.nama;
    document.getElementById("input-brand-a").value = a.brand;
    document.getElementById("input-jenis-a").value = a.jenis;
    document.getElementById("input-harga-a").value = a.harga;
    document.getElementById("hidden-edit-kode-a").value = a.kode;

    // Isi nilai per kriteria
    NILAI[idx].forEach((v, j) => {
      const inp = document.getElementById(`input-nilai-${j}`);
      if (inp) inp.value = v;
    });

    document.querySelector("#form-alternatif .form-title").textContent = `✏️ Edit Alternatif ${kode}`;
    document.getElementById("form-alternatif").scrollIntoView({ behavior: "smooth" });
  }

  // ── KUMPULKAN NILAI DARI FORM ─────────────────────────────────────────────
  function kumpulkanNilai() {
    return KRITERIA.map((_, j) => {
      const inp = document.getElementById(`input-nilai-${j}`);
      return inp ? parseFloat(inp.value) : 0;
    });
  }

  // ── SIMPAN ────────────────────────────────────────────────────────────────
  function simpan() {
    const kodeEdit = document.getElementById("hidden-edit-kode-a").value;
    const data = {
      kode:  document.getElementById("input-kode-a").value.trim(),
      nama:  document.getElementById("input-nama-a").value.trim(),
      brand: document.getElementById("input-brand-a").value.trim(),
      jenis: document.getElementById("input-jenis-a").value,
      harga: document.getElementById("input-harga-a").value,
    };

    const nilaiArr = kumpulkanNilai();

    let hasil;
    if (kodeEdit) {
      hasil = API.alternatif.update(kodeEdit, data, nilaiArr);
    } else {
      hasil = API.alternatif.create(data, nilaiArr);
    }

    tampilkanNotif(hasil);
    if (hasil.success) {
      resetForm();
      renderTabel();
    }
  }

  // ── HAPUS ─────────────────────────────────────────────────────────────────
  function hapus(kode) {
    if (!confirm(`Hapus alternatif ${kode}?`)) return;

    const hasil = API.alternatif.delete(kode);
    tampilkanNotif(hasil);
    if (hasil.success) renderTabel();
  }

  // ── RESET FORM ────────────────────────────────────────────────────────────
  function resetForm() {
    ["input-kode-a", "input-nama-a", "input-brand-a", "input-harga-a"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    document.getElementById("input-jenis-a").value = "Serum";
    document.getElementById("hidden-edit-kode-a").value = "";
    document.querySelector("#form-alternatif .form-title").textContent = "➕ Tambah Alternatif Baru";

    KRITERIA.forEach((_, j) => {
      const inp = document.getElementById(`input-nilai-${j}`);
      if (inp) inp.value = "";
    });

    sembunyikanNotif();
  }

  // ── NOTIFIKASI ────────────────────────────────────────────────────────────
  function tampilkanNotif(hasil) {
    const el = document.getElementById("notif-alternatif");
    if (!el) return;
    el.textContent = hasil.message;
    el.className   = `notif show ${hasil.success ? "success" : "error"}`;
    setTimeout(() => sembunyikanNotif(), 3000);
  }

  function sembunyikanNotif() {
    const el = document.getElementById("notif-alternatif");
    if (el) el.className = "notif";
  }

  return { render, isiFormEdit, simpan, hapus, resetForm };
})();
