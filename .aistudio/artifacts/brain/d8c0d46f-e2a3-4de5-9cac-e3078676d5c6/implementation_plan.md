# KIDQUEST — Peningkatan UI/UX Responsif Mobile & Gamifikasi RPG

Rencana teknis komprehensif untuk meningkatkan pengalaman antarmuka pengguna (UI/UX) KIDQUEST agar responsif sempurna di perangkat seluler (smartphone dan tablet) serta desktop, dengan navigasi *bottom tab bar* mobile, visual RPG interaktif ramah anak (6–9 tahun), dan penyederhanaan portal orang tua.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan desain berikut telah dikonfirmasi melalui klarifikasi tahap awal:

- **Confirmed Decision 1: Navigasi Mobile**: Menggunakan *fixed bottom navigation bar* pada smartphone dengan ikon dan label ramah sentuhan, dipadukan dengan *segmented tabs* pada layar desktop/tablet.
- **Confirmed Decision 2: Gaya Visual Arena Anak**: Kartu RPG cerah (*vibrant RPG cards*) dengan meteran XP bercahaya (*glowing XP meters*), badge lencana interaktif, dan tipografi ramah anak (*Fredoka* + *Plus Jakarta Sans*).
- **Confirmed Decision 3: Timer Hiburan**: Timer sirkular animasi interaktif (*circular SVG countdown timer*) dengan tombol kontrol sentuh besar ($\ge 48\text{px}$) untuk kenyamanan jari anak.
- **Recommended Default: Tata Letak Parent View**: Kartu ringkasan metrik 2-kolom pada smartphone (4-kolom pada desktop), dan *Approval Center* dengan tombol aksi cepat (*1-tap approve/review*) tanpa menyembunyikan detail ledger.

---

## 1. Overview & Core Concept

- **What It Does**: Memperbarui antarmuka KIDQUEST agar memiliki tata letak responsif adaptif dari $375\text{px}$ (smartphone kecil) hingga $1440\text{px}$ (desktop), tanpa elemen terpotong, padding yang proporsional, dan navigasi ergonomis di zona jangkauan ibu jari (*natural thumb zone*).
- **Target Audience**: 
  - Anak usia 6–9 tahun yang menggunakan smartphone/tablet orang tua dengan interaksi sentuh visual yang menyenangkan.
  - Orang tua yang memantau dan menyetujui tugas di mana saja melalui perangkat genggam dengan efisiensi tinggi.
- **Key Value**: Pengalaman pengguna yang nyaman, bebas jank, ramah sentuhan (*touch-friendly*), dan mempertahankan integritas *ledger accounting* serta *universal time wallet*.

---

## 2. User Experience & Visual Design

### 2.1 Navigasi & Tata Letak Responsif
- **Header Adaptif**:
  - Pada mobile ($< 640\text{px}$): Header ringkas ($56\text{px}$) dengan logo kompak, status role aktif, dan tombol switch role yang mudah disentuh.
  - Pada desktop ($\ge 1024\text{px}$): Header penuh dengan saldo dompet waktu dan indikator badge approval.
- **Mobile Bottom Navigation Bar**:
  - Khusus tampilan smartphone, navigasi utama dipindahkan ke bagian bawah (*fixed bottom-0*) dengan tinggi $64\text{px}$ dan padding aman (`pb-safe`).
  - Untuk Anak: 🏠 Beranda, 📜 Quest, ⏳ Timer, 🛡️ Karakter, 🏆 Piala.
  - Untuk Orang Tua: 📊 Ringkasan, ✅ Approval, 📜 Quest, ⏳ Dompet, ⚖️ Aturan.
- **Desktop/Tablet Segmented Control**:
  - Pada layar lebar, navigasi tetap berupa tab horizontal yang elegan dengan animasi hover halus.

### 2.2 Visual Arena Anak (Child Arena RPG)
- **Hero Avatar Banner**:
  - Card avatar dengan efek gradien dinamis dan badge level RPG melayang (*floating level badge*).
  - XP Meter interaktif dengan indikator sisa XP menuju level berikutnya.
- **Quest Cards RPG**:
  - Kartu quest bertema petualangan dengan pemisah kategori warna-warni (Rutinitas Pagi, Belajar, Bantu Rumah, Kebersihan).
  - Tombol aksi utama "Ajukan Selesai" dengan ukuran target sentuh minimal $48\text{px}$ (`min-h-[48px]`), ikon jelas, dan transisi tactile saat ditekan (`active:scale-95`).
- **Circular Animated Timer (Time Manager)**:
  - Lingkaran progres SVG animasi (*radial progress ring*) yang menyusut mulus seiring berjalannya detik.
  - Digit waktu font monospace besar di tengah lingkaran.
  - Tombol mulai/selesai sesi permainan game dan video YouTube yang kontras dan jelas.

### 2.3 Dashboard Orang Tua (Parent Portal)
- **Ringkasan Cepat**:
  - Kartu profil anak dengan metrik saldo waktu, batas harian, dan indikator aktivitas aktif.
  - Grid metrik responsif: 2 kolom pada mobile, 4 kolom pada desktop.
- **Approval Center Kompak**:
  - Kartu pengajuan dengan catatan anak ditampilkan secara jelas.
  - Aksi *Approve* (hijau) dan *Minta Revisi* (kuning) dapat diakses dengan 1 ketukan pada mobile.
- **Penyesuaian Dompet Waktu & Audit Log**:
  - Formulir modal sentuh untuk penambahan/pengurangan waktu dengan riwayat transaksi ledger tetap transparan.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Bottom Navigation Bar vs Drawer Menu**
  - *Chosen Approach*: Bottom tab bar untuk smartphone.
  - *Why*: Ergonomi jempol (*thumb-zone*) lebih cepat diakses dengan satu tangan dibandingkan menu hamburger drawer di pojok atas layar.
- **Decision 2: Circular Progress Timer vs Simple Number Box**
  - *Chosen Approach*: Circular SVG countdown ring.
  - *Why*: Anak usia 6–9 tahun lebih intuitif memahami visual waktu yang berkurang melalui lingkaran proporsional daripada sekadar membaca angka detik.
- **Decision 3: Single Codebase Responsive Layout**
  - *Chosen Approach*: Menggunakan utilitas adaptif Tailwind CSS (`sm:`, `md:`, `lg:`) tanpa menduplikasi komponen terpisah.
  - *Why*: Memudahkan pemeliharaan kode dan memastikan state tersinkronisasi mulus saat orientasi layar diputar (*orientation change*).

---

## 4. Technical Architecture & Data Strategy

```
+---------------------------------------------------------------+
|                       KIDQUEST App (Root)                     |
|                                                               |
|  +---------------------------------------------------------+  |
|  |             Header (Responsive Dual-Role Bar)           |  |
|  +---------------------------------------------------------+  |
|                                                               |
|  [ Current View: CHILD ]            [ Current View: PARENT ]  |
|  +-----------------------+          +-----------------------+ |
|  | ChildView             |          | ParentView            | |
|  | - Hero Avatar Card    |          | - Overview Metrics    | |
|  | - Glowing XP Progress |          | - Quick Child Cards   | |
|  | - Quest Card Grid     |          | - Approval Center     | |
|  | - Circular Timer Ring |          | - Time Ledger Manager | |
|  | - Bottom Nav Bar (m)  |          | - Bottom Nav Bar (m)  | |
|  +-----------+-----------+          +-----------+-----------+ |
|              |                                  |             |
|              +-----------------+----------------+             |
|                                v                              |
|  +---------------------------------------------------------+  |
|  |       StorageService & Ledger Engine (Append-Only)      |  |
|  |       - xpTransactions | timeTransactions               |  |
|  |       - computeTimeBalance() | calculateLevel()         |  |
|  +---------------------------------------------------------+  |
+---------------------------------------------------------------+
```

### Component State Mapping:
1. `Header.tsx`: Mengatur role switch, badge jumlah approval tertunda, dan layout responsif untuk mobile bar.
2. `ChildView.tsx`: Mengatur sub-tab aktif (Beranda, Quest, Timer, Karakter, Piala, Riwayat), rendering timer lingkaran SVG, modal pengajuan quest dengan bottom-sheet pada mobile.
3. `ParentView.tsx`: Mengatur navigasi mobile bottom bar dan tab desktop, rendering approval queue, form quest baru, dan penyesuaian saldo ledger.
4. `index.css`: Penambahan styling utilitas touch target, circular SVG progress, dan safe-area inset.
