/**
 * app.js
 * -------
 * Entry point frontend
 * Mengurus navigasi antar halaman (tab routing)
 * dan inisialisasi awal saat halaman dimuat
 */

// Pindah ke halaman tertentu
function showPage(id) {
  // Sembunyikan semua halaman
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));

  // Nonaktifkan semua tombol tab
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));

  // Tampilkan halaman yang dipilih
  document.getElementById(id).classList.add("active");

  // Aktifkan tombol tab yang sesuai
  // event.currentTarget dipakai supaya tombol yang diklik langsung di-highlight
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }

  // Panggil fungsi render untuk halaman itu
  renderPage(id);
}

// Dispatch ke render function masing-masing halaman
function renderPage(id) {
  switch (id) {
    case "beranda":     PageBeranda.render();      break;
    case "kriteria":    PageKriteria.render();      break;
    case "alternatif":  PageAlternatif.render();    break;
    case "nilai":       PageNilai.render();         break;
    case "normalisasi": PageNormalisasi.render();   break;
    case "perhitungan": PagePerhitungan.render();   break;
    case "hasil":       PageHasil.render();         break;
    default:
      console.warn("Halaman tidak dikenali:", id);
  }
}

// Inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  // Render halaman beranda sebagai default
  renderPage("beranda");
});
