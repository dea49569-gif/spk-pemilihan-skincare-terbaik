/**
 * api.js
 * -------
 * Simulasi "routing" API untuk project SPK ini.
 *
 * Karena project ini pure frontend (tidak pakai Node.js/Express),
 * file ini mensimulasikan logika routing yang biasa ada di backend.
 *
 * Struktur endpoint (kalau nanti diubah ke Express.js):
 *
 *   GET    /api/kriteria           → KriteriaController.getAll()
 *   GET    /api/kriteria/:kode     → KriteriaController.getByKode()
 *   POST   /api/kriteria           → KriteriaController.create()
 *   PUT    /api/kriteria/:kode     → KriteriaController.update()
 *   DELETE /api/kriteria/:kode     → KriteriaController.remove()
 *
 *   GET    /api/alternatif         → AlternatifController.getAll()
 *   GET    /api/alternatif/:kode   → AlternatifController.getByKode()
 *   POST   /api/alternatif         → AlternatifController.create()
 *   PUT    /api/alternatif/:kode   → AlternatifController.update()
 *   DELETE /api/alternatif/:kode   → AlternatifController.remove()
 *
 *   GET    /api/hasil              → SAW.hitungSemua()
 */

const API = {
  // ── KRITERIA ──────────────────────────────────────────────────────────────
  kriteria: {
    getAll:    ()         => KriteriaController.getAll(),
    getOne:    (kode)     => KriteriaController.getByKode(kode),
    create:    (data)     => KriteriaController.create(data),
    update:    (kode, d)  => KriteriaController.update(kode, d),
    delete:    (kode)     => KriteriaController.remove(kode),
    totalBobot:()         => KriteriaController.totalBobot(),
  },

  // ── ALTERNATIF ────────────────────────────────────────────────────────────
  alternatif: {
    getAll:   ()              => AlternatifController.getAll(),
    getOne:   (kode)          => AlternatifController.getByKode(kode),
    create:   (data, nilai)   => AlternatifController.create(data, nilai),
    update:   (kode, d, nilai)=> AlternatifController.update(kode, d, nilai),
    delete:   (kode)          => AlternatifController.remove(kode),
  },

  // ── HASIL SAW ─────────────────────────────────────────────────────────────
  hasil: {
    getRanking: () => SAW.hitungSemua(),
  },
};
