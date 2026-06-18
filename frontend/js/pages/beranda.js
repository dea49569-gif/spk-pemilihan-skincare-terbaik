/**
 * pages/beranda.js
 * -----------------
 * Render konten halaman Beranda (info summary + penjelasan SAW)
 * Konten statis, tidak ada interaksi CRUD
 */

const PageBeranda = (() => {

  function render() {
    // Update angka-angka di info grid supaya selalu sesuai data terkini
    const elAlt = document.getElementById("info-jumlah-alt");
    const elKri = document.getElementById("info-jumlah-kri");

    if (elAlt) elAlt.textContent = ALTERNATIF.length;
    if (elKri) elKri.textContent = KRITERIA.length;
  }

  return { render };
})();
