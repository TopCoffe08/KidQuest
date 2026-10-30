# KIDQUEST — Your Life, Your Level

> **Aplikasi Gamifikasi Kebiasaan Positif Keluarga dan Manajemen Waktu Anak dengan Mekanisme RPG.**

---

## 🛡️ Visi & Prinsip Utama
> *"Build responsibility through positive reinforcement, not fear."*

KIDQUEST membantu anak (khususnya usia 6–9 tahun) membangun kebiasaan positif, kedisiplinan, dan manajemen waktu hiburan digital (screen-time) melalui pengalaman bermain RPG yang menyenangkan dan bermakna:
- **Aktivitas Positif** $\rightarrow$ **Quest Selesai** $\rightarrow$ **Persetujuan Orang Tua** $\rightarrow$ **XP & Bonus Waktu** $\rightarrow$ **Naik Level & Buka Achievement**.
- **Universal Time Wallet:** Menit waktu hiburan diperoleh dari kebiasaan baik dan dikelola dengan batasan sehat yang disepakati bersama.
- **Konsekuensi Restoratif:** Mengedepankan tindakan perbaikan dan refleksi, bukan hukuman atau pembatasan kebutuhan dasar.

---

## 🏛️ Arsitektur & Teknologi

| Lapisan | Teknologi | Deskripsi |
|---|---|---|
| **Frontend** | React 19 + TypeScript | UI Dual-Mode (Parent Control & Child RPG Interface) |
| **Styling** | Tailwind CSS v4 + Motion | Desain modern, ceria, ramah anak, dan responsif |
| **Icons** | Lucide React | Ikonografi intuitif |
| **Client Storage** | IndexedDB / Local Cache | Offline-first support & toleransi putus jaringan |
| **Backend API** | Node.js + Express / REST | Validasi bisnis, otorisasi RBAC, server-clock timer |
| **Database** | SQLite (Prisma Schema Ready) | Append-Only Ledger untuk transaksi XP & Waktu |
| **Mobile Ready** | Capacitor (Android) | Persiapan integrasi native Android |

---

## 📂 Struktur Proyek

```text
/
├── docs/
│   ├── PRD.md              # Product Requirements Document
│   ├── ARCHITECTURE.md     # Arsitektur sistem & strategi Local-First
│   ├── DATABASE.md         # Desain skema relational & ledger audit
│   └── API.md              # Spesifikasi REST API
├── src/
│   ├── components/         # Komponen UI modular (Parent & Child UI)
│   ├── services/           # Service layer (Ledger, Quest, TimeManager, Storage)
│   ├── types/              # Type definitions TypeScript
│   ├── App.tsx             # Root application view
│   └── main.tsx            # Entry point
├── MASTER-PROMPT.md        # Dokumen acuan utama pengembangan proyek
├── README.md               # Dokumentasi ikhtisar
└── CHANGELOG.md            # Catatan riwayat versi & perubahan
```

---

## 🚀 Status Pengembangan
- **Fase Saat Ini:** Fase 0 (Fondasi Arsitektur, Dokumentasi Teknis, & Setup Basis Proyek).
- Dokumentasi lengkap tersedia di direktori `docs/`.
