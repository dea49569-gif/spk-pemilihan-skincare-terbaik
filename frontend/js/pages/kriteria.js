/**
 * pages/kriteria.js
 * ------------------
 * Render halaman Kriteria: tabel, grafik bobot, dan form CRUD
 *
 * Fitur:
 * - Tampilkan daftar semua kriteria
 * - Form tambah kriteria baru
 * - Tombol Edit (isi form dengan data yang ada)
 * - Tombol Hapus (dengan konfirmasi)
 */

const PageKriteria = (() => {

  // ── RENDER UTAMA ──────────────────────────────────────────────────────────
  function render() {
    renderTabel();
    renderGrafikBobot();
    renderForm();
  }

  // ── TABEL KRITERIA ────────────────────────────────────────────────────────
  function renderTabel() {
    const tabel = document.getElementById("tbl-kriteria");
    if (!tabel) return;

    let html = `
      <thead>
        <tr>
          <th>Kode</th>
          <th>Nama Kriteria</th>
          <th>Bobot</th>
          <th>Bobot (%)</th>
          <th>Jenis</th>
          <th>Keterangan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
    `;

    KRITERIA.forEach((k) => {
      const badgeClass = k.jenis === "benefit" ? "badge-benefit" : "badge-cost";
      html += `
        <tr>
          <td><strong>${k.kode}</strong></td>
          <td>${k.nama}</td>
          <td class="highlight">${k.bobot}</td>
          <td>${(k.bobot * 100).toFixed(0)}%</td>
          <td><span class="badge ${badgeClass}">${k.jenis.toUpperCase()}</span></td>
          <td class="text-muted">${k.keterangan}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="PageKriteria.isiFormEdit('${k.kode}')">✏️ Edit</button>
            <button class="btn btn-sm btn-danger" onclick="PageKriteria.hapus('${k.kode}')">🗑️</button>
          </td>
        </tr>
      `;
    });

    // Tampilkan total bobot
    const total = KriteriaController.totalBobot();
    const warnaCls = Math.abs(total - 1) < 0.001 ? "color:var(--green)" : "color:var(--red)";
    html += `
      <tr style="background:var(--soft);font-weight:700">
        <td colspan="2" style="text-align:right;padding-right:1rem">Total Bobot:</td>
        <td style="${warnaCls}">${total.toFixed(2)}</td>
        <td style="${warnaCls}">${(total * 100).toFixed(0)}%</td>
        <td colspan="3"></td>
      </tr>
    `;

    html += "</tbody>";
    tabel.innerHTML = html;
  }

  // ── GRAFIK BOBOT ──────────────────────────────────────────────────────────
  function renderGrafikBobot() {
    const el = document.getElementById("bobot-chart");
    if (!el) return;

    el.innerHTML = "";

    KRITERIA.forEach((k) => {
      const pct = (k.bobot * 100).toFixed(0);
      // lebar bar maks 100% dari container (bobot maks = 0.25 → 100px, dikali 4 = 100px)
      const lebarPx = pct * 4;

      el.innerHTML += `
        <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.7rem;">
          <div style="width:35px;font-size:.75rem;font-weight:700;color:var(--muted)">${k.kode}</div>
          <div style="flex:1;background:#F0E4EA;border-radius:6px;height:22px;position:relative;">
            <div style="width:${lebarPx}px;max-width:100%;height:22px;background:linear-gradient(90deg,var(--rose),var(--gold));border-radius:6px;transition:width 1s;"></div>
          </div>
          <div style="width:90px;font-size:.82rem;font-weight:700;color:var(--rose)">${pct}% (${k.bobot})</div>
        </div>
      `;
    });
  }

  // ── FORM CRUD ─────────────────────────────────────────────────────────────
  function renderForm() {
    // Form sudah ada di HTML, tidak perlu dirender ulang
    // Cukup reset form saat halaman dibuka
    resetForm();
  }

  function resetForm() {
    const form = document.getElementById("form-kriteria");
    if (!form) return;

    form.querySelector("#input-kode-k").value     = "";
    form.querySelector("#input-nama-k").value     = "";
    form.querySelector("#input-bobot-k").value    = "";
    form.querySelector("#input-jenis-k").value    = "benefit";
    form.querySelector("#input-keterangan-k").value = "";
    form.querySelector("#hidden-edit-kode").value = ""; // kosong = mode tambah

    document.querySelector("#form-kriteria .form-title").textContent = "➕ Tambah Kriteria Baru";
    sembunyikanNotif();
  }

  // ── ISIAN FORM UNTUK EDIT ─────────────────────────────────────────────────
  function isiFormEdit(kode) {
    const k = KriteriaController.getOne(kode);
    if (!k) return;

    document.getElementById("input-kode-k").value      = k.kode;
    document.getElementById("input-nama-k").value      = k.nama;
    document.getElementById("input-bobot-k").value     = k.bobot;
    document.getElementById("input-jenis-k").value     = k.jenis;
    document.getElementById("input-keterangan-k").value= k.keterangan;
    document.getElementById("hidden-edit-kode").value  = k.kode; // tanda mode edit

    document.querySelector("#form-kriteria .form-title").textContent = `✏️ Edit Kriteria ${kode}`;

    // Scroll ke form
    document.getElementById("form-kriteria").scrollIntoView({ behavior: "smooth" });
  }

  // ── SIMPAN (Tambah atau Update) ───────────────────────────────────────────
  function simpan() {
    const kodeEdit = document.getElementById("hidden-edit-kode").value;
    const data = {
      kode:       document.getElementById("input-kode-k").value.trim(),
      nama:       document.getElementById("input-nama-k").value.trim(),
      bobot:      document.getElementById("input-bobot-k").value,
      jenis:      document.getElementById("input-jenis-k").value,
      keterangan: document.getElementById("input-keterangan-k").value.trim(),
    };

    let hasil;
    if (kodeEdit) {
      // Mode edit
      hasil = API.kriteria.update(kodeEdit, data);
    } else {
      // Mode tambah
      hasil = API.kriteria.create(data);
    }

    tampilkanNotif(hasil);

    if (hasil.success) {
      resetForm();
      renderTabel();
      renderGrafikBobot();
    }
  }

  // ── HAPUS ─────────────────────────────────────────────────────────────────
  function hapus(kode) {
    const konfirmasi = confirm(`Yakin mau hapus kriteria ${kode}?\nSemua nilai untuk kriteria ini juga akan ikut terhapus.`);
    if (!konfirmasi) return;

    const hasil = API.kriteria.delete(kode);
    tampilkanNotif(hasil);

    if (hasil.success) {
      renderTabel();
      renderGrafikBobot();
    }
  }

  // ── NOTIFIKASI ────────────────────────────────────────────────────────────
  function tampilkanNotif(hasil) {
    const el = document.getElementById("notif-kriteria");
    if (!el) return;

    el.textContent = hasil.message;
    el.className   = `notif show ${hasil.success ? "success" : "error"}`;

    setTimeout(() => sembunyikanNotif(), 3000);
  }

  function sembunyikanNotif() {
    const el = document.getElementById("notif-kriteria");
    if (el) el.className = "notif";
  }

  // Expose ke HTML (onclick="PageKriteria.xxx()")
  return { render, isiFormEdit, simpan, hapus, resetForm };
})();
