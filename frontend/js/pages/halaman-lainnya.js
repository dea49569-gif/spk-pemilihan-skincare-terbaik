/**
 * pages/nilai.js
 * ---------------
 * Render halaman Matriks Nilai (Matriks Keputusan)
 * Menampilkan nilai mentah setiap alternatif per kriteria
 */

const PageNilai = (() => {

  function render() {
    const tabel = document.getElementById("tbl-nilai");
    if (!tabel) return;

    // Header: kolom kode, nama, lalu satu kolom per kriteria
    let html = "<thead><tr><th>Kode</th><th>Nama Produk</th>";
    KRITERIA.forEach((k) => {
      html += `<th>${k.kode}<br><small style="font-weight:400;color:var(--muted)">${k.jenis}</small></th>`;
    });
    html += "</tr></thead><tbody>";

    // Isi baris
    NILAI.forEach((baris, i) => {
      html += `<tr>
        <td><strong>${ALTERNATIF[i].kode}</strong></td>
        <td>${ALTERNATIF[i].nama}</td>
      `;
      baris.forEach((v, j) => {
        // Kolom C1 (Harga) tampilkan dengan format rupiah
        const tampil = j === 0 ? SAW.fmtHarga(v) : v;
        html += `<td>${tampil}</td>`;
      });
      html += "</tr>";
    });

    tabel.innerHTML = html + "</tbody>";
  }

  return { render };
})();


/**
 * pages/normalisasi.js
 * ---------------------
 * Render proses normalisasi matriks langkah demi langkah
 * + tabel matriks ternormalisasi R
 */

const PageNormalisasi = (() => {

  function render() {
    renderLangkah();
    renderMatriksR();
  }

  // Tampilkan langkah normalisasi per kriteria
  function renderLangkah() {
    const container = document.getElementById("normalisasi-steps");
    if (!container) return;

    const R = SAW.normalisasiMatriks();
    let html = "";

    KRITERIA.forEach((k, j) => {
      const kolomNilai = SAW.ambilKolom(j);
      const maks = Math.max(...kolomNilai);
      const mini = Math.min(...kolomNilai);

      let detail = "";
      ALTERNATIF.forEach((a, i) => {
        const rij = R[i][j];
        let rumus = "";
        if (k.jenis === "benefit") {
          rumus = `${NILAI[i][j]} / ${maks} = ${SAW.fmt(rij)}`;
        } else {
          rumus = `${mini} / ${NILAI[i][j]} = ${SAW.fmt(rij)}`;
        }

        detail += `
          <div style="font-size:.8rem;padding:.15rem 0;border-bottom:1px solid #F0E4EA">
            <strong>${a.kode}:</strong>
            r<sub>${i + 1}${j + 1}</sub> = ${rumus}
          </div>
        `;
      });

      const infoMinMax = k.jenis === "benefit"
        ? `Max = ${maks}`
        : `Min = ${mini}`;

      html += `
        <div class="step-box">
          <div class="step-title">
            ${k.kode} — ${k.nama} (${k.jenis.toUpperCase()}) &nbsp;·&nbsp; ${infoMinMax}
          </div>
          ${detail}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Tabel matriks R yang sudah ternormalisasi
  function renderMatriksR() {
    const tabel = document.getElementById("tbl-norm");
    if (!tabel) return;

    const R = SAW.normalisasiMatriks();

    let html = "<thead><tr><th>Kode</th>";
    KRITERIA.forEach((k) => { html += `<th>${k.kode}</th>`; });
    html += "</tr></thead><tbody>";

    R.forEach((baris, i) => {
      html += `<tr><td><strong>${ALTERNATIF[i].kode}</strong></td>`;
      baris.forEach((v) => { html += `<td>${SAW.fmt(v)}</td>`; });
      html += "</tr>";
    });

    tabel.innerHTML = html + "</tbody>";
  }

  return { render };
})();


/**
 * pages/perhitungan.js
 * ---------------------
 * Render detail perhitungan nilai preferensi Vi per alternatif
 * Menunjukkan rumus lengkap: Vi = (w1×r_i1) + (w2×r_i2) + ...
 */

const PagePerhitungan = (() => {

  function render() {
    const container = document.getElementById("perhitungan-detail");
    if (!container) return;

    const R = SAW.normalisasiMatriks();
    const bobotTeks = KRITERIA.map((k) => `w${KRITERIA.indexOf(k) + 1}=${k.bobot}`).join(" | ");

    let html = "";

    ALTERNATIF.forEach((a, i) => {
      // Susun bagian (wj × rij)
      const bagian = KRITERIA.map((k, j) =>
        `(${k.bobot} × ${SAW.fmt(R[i][j])})`
      ).join(" + ");

      // Hasil per bagian
      const hasilBagian = KRITERIA.map((k, j) =>
        (k.bobot * R[i][j]).toFixed(4)
      ).join(" + ");

      // Total Vi
      const vi = KRITERIA.reduce((sum, k, j) => sum + k.bobot * R[i][j], 0);

      html += `
        <div class="step-box">
          <div class="step-title">${a.kode} — ${a.nama}</div>
          <div class="formula">
            V = ${bagian}<br>
            V = ${hasilBagian}<br>
            <strong>V<sub>${i + 1}</sub> = ${SAW.fmt(vi)}</strong>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Update teks bobot di atas
    const elBobot = document.getElementById("info-bobot-perhitungan");
    if (elBobot) elBobot.textContent = bobotTeks;
  }

  return { render };
})();


/**
 * pages/hasil.js
 * ---------------
 * Render halaman Hasil & Ranking akhir
 * - Hero section pemenang
 * - Tabel ranking lengkap
 * - Kartu ranking dengan progress bar
 */

const PageHasil = (() => {

  function render() {
    const ranking = SAW.hitungSemua();
    renderHero(ranking);
    renderTabel(ranking);
    renderKartu(ranking);
  }

  // Kotak pemenang paling atas
  function renderHero(ranking) {
    const container = document.getElementById("winner-section");
    if (!container) return;

    const pemenang = ranking[0];
    const a        = pemenang.alternatif;

    container.innerHTML = `
      <div class="winner-hero">
        <div class="crown">👑</div>
        <h2>${a.nama}</h2>
        <div style="opacity:.8;margin:.2rem 0">${a.brand} · ${a.jenis}</div>
        <div class="win-score">
          Nilai Preferensi Tertinggi: <strong>${SAW.fmt(pemenang.vi)}</strong>
        </div>
      </div>
    `;
  }

  // Tabel ranking semua alternatif
  function renderTabel(ranking) {
    const tabel = document.getElementById("tbl-hasil");
    if (!tabel) return;

    let html = `
      <thead>
        <tr>
          <th>Rank</th>
          <th>Kode</th>
          <th>Nama Produk</th>
          <th>Brand</th>
          <th>Nilai Vi</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
    `;

    ranking.forEach((obj) => {
      const a    = obj.alternatif;
      const rank = obj.rank;
      const medali    = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
      const badgeCls  = rank === 1 ? "badge-rank1" : rank === 2 ? "badge-rank2" : rank === 3 ? "badge-rank3" : "";

      html += `
        <tr>
          <td><span class="badge ${badgeCls}">${medali} #${rank}</span></td>
          <td><strong>${a.kode}</strong></td>
          <td>${a.nama}</td>
          <td>${a.brand}</td>
          <td class="highlight">${SAW.fmt(obj.vi)}</td>
          <td>
            ${rank === 1 ? '<span class="badge badge-benefit">TERBAIK ✓</span>' : ""}
          </td>
        </tr>
      `;
    });

    tabel.innerHTML = html + "</tbody>";
  }

  // Kartu ranking dengan progress bar
  function renderKartu(ranking) {
    const container = document.getElementById("rank-cards");
    if (!container) return;

    container.innerHTML = "";

    const nilaiTertinggi = ranking[0].vi;

    ranking.forEach((obj) => {
      const a    = obj.alternatif;
      const rank = obj.rank;
      const pct  = (obj.vi / nilaiTertinggi * 100).toFixed(1);
      const cls  = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
      const medali = rank === 1 ? "🥇 " : rank === 2 ? "🥈 " : rank === 3 ? "🥉 " : "";

      container.innerHTML += `
        <div class="rank-card ${cls}">
          <div class="rank-num">${rank}</div>
          <h3>${medali}${a.nama}</h3>
          <div class="brand">${a.brand} · ${a.jenis}</div>
          <div class="score-bar-wrap">
            <div class="score-bar" style="width:${pct}%"></div>
          </div>
          <div class="score-val">Vi = ${SAW.fmt(obj.vi)} &nbsp;(${pct}%)</div>
        </div>
      `;
    });
  }

  return { render };
})();
