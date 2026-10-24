# DESIGN.md — DORE Coffee & Pastry (POS & Table Self-Ordering)

## Overview
Aplikasi web modern, bersih, dan fungsional untuk kafe artisanal **DORE Coffee & Pastry**.
Memiliki 2 pengalaman pengguna yang berbeda:
1. **Customer (Mobile-first)**: Pelanggan scan QR meja, langsung lihat menu, kustomisasi minuman, dan order tanpa login.
2. **Kasir / Admin (Tablet & Desktop-first)**: Kasir memproses pesanan masuk, POS counter, bayar tunai/QRIS, dan cetak struk.
Bahasa: Indonesia (ramah, modern, jelas).

---

## Colors
Diambil langsung dari identitas visual menu **DORE Coffee & Pastry**:
- **Primary**: `#1E3A8A` (Deep Royal Navy Blue) — dipakai untuk header brand, tombol CTA utama, harga aktif, dan identitas meja.
- **Secondary / Accent**: `#3B82F6` (Electric Blue) — hover state, badge aktif, dan link.
- **Accent Light**: `#DBEAFE` (Soft Powder Blue) — background badge meja, category pill aktif, dan highlight order.
- **Background Main**: `#F8FAFC` (Slate Ultra Light) — latar belakang seluruh aplikasi.
- **Card Surface**: `#FFFFFF` (Pure White) — container kartu menu, panel pesanan, dan modal.
- **Text Primary**: `#0F172A` (Deep Charcoal Black) — judul menu, harga, dan heading.
- **Text Muted**: `#64748B` (Cool Slate Grey) — deskripsi, subtitle meja, dan catatan.
- **Border**: `#E2E8F0` (Subtle Light Border).
- **Status Indicators**:
  - Menunggu Konfirmasi: `#F59E0B` (Amber / Kuning)
  - Sedang Diproses: `#2563EB` (Royal Blue)
  - Siap / Selesai: `#10B981` (Emerald Green)

Maksimal 3 warna dominan di setiap layar (Navy Blue, White/Slate, dan Accent).

---

## Typography
- **Heading**: `Plus Jakarta Sans` atau `Inter`, font-weight 700–800 (Bold & Modern).
- **Body & Subtitle**: `Inter`, font-weight 400 (Regular) dan 500 (Medium).
- **Ukuran Teks Minimum**: 14px pada mobile agar mudah dibaca di bawah pencahayaan kafe.
- **Format Harga**: Standar Indonesia dengan titik pemisah ribuan (contoh: `Rp 23.000`), tebal dan kontras tinggi.

---

## Layout & Hierarchy

### 1. Customer View (Mobile: 390px - 430px)
- **Sticky Top Bar**: Logo DORE + Badge "Meja 04" + Search bar kecil.
- **Horizontal Category Pills**: *All, Coffee, Matcha, Non Coffee, Tea, Snack, Food, Additional* (bisa digeser ke samping).
- **Menu Grid**: 2 kolom atau vertical list card dengan foto produk, nama, harga, dan tombol `+` rounded.
- **Floating Cart Bar**: Sticky di bagian bawah layar: `X Item | Rp Total` + Tombol `Lihat Pesanan`.
- **Order Tracking Stepper**: Visual step 1 (Diterima) → 2 (Dibuat) → 3 (Siap Disajikan).

### 2. Cashier & Admin View (Tablet / Desktop: 1024px+)
- **Dual Column Workspace**:
  - Kolom Kiri: **Live Orders Feed (Dapur/Barista)** — kartu antrean meja real-time dengan timer dan tombol ubah status.
  - Kolom Kanan: **POS Register & Struk** — grid produk cepat, ringkasan keranjang kasir, tombol pembayaran (Tunai / QRIS), dan print struk thermal 58mm.

---

## Components

### Customer Components:
- **Table Badge**: Chip pill warna `#DBEAFE` dengan teks `#1E3A8A` tebal bertuliskan "Meja 04".
- **Product Card**: Background putih, rounded-2xl (16px), shadow lembut, foto rasio 1:1, badge kategori, dan tombol tambah cepat.
- **Customization Bottom Sheet**: Modal geser dari bawah:
  - Toggle Temperature: `[ Ice ]` (default) / `[ Hot ]`
  - Radio Sugar: `Normal (100%)` / `Less Sugar (50%)` / `No Sugar (0%)`
  - Add-on Checkbox: `+ Espresso Shot (Rp 5.000)`, `+ Extra Syrup (Rp 5.000)`
  - Textarea: Catatan untuk barista/koki.
- **Live Status Card**: Animasi indikator pulsasi lembut saat pesanan sedang dibuat.

### Admin / Cashier Components:
- **Order Kanban Card**: Menampilkan nomor meja, nama tamu, daftar item, total harga, durasi tunggu, dan tombol aksi (`Terima`, `Siap Saji`).
- **Payment Modal**: Input nominal uang tunai dengan tombol cepat pecahan (`Rp 50.000`, `Rp 100.000`, Uang Pas), kalkulator kembalian otomatis, atau tab switch QRIS.
- **Thermal Receipt Preview**: Komponen struk monospace putih dengan logo DORE, rincian pesanan, garis putus-putus, dan total bayar.
- **Table QR Generator Card**: Kartu display nomor meja dengan QR code di tengah yang siap diunduh / dicetak langsung.

---

## Menu & Price Catalog Reference (Wajib Dipakai di UI Stitch)

Gunakan data menu asli dari DORE Coffee & Pastry ini untuk teks card menu dan mock data di Google Stitch:

### ☕ COFFEE
- Americano : Rp 15.000
- Honey americano : Rp 22.000
- Cranberrycano : Rp 21.000
- Orange americano : Rp 23.000
- Doremilk coffee : Rp 20.000
- Kopi susu aren : Rp 23.000
- Kopi susu pandan : Rp 23.000
- Hazelnut : Rp 23.000
- Salted caramel : Rp 25.000
- Popcorn Coffee : Rp 25.000
- Butterscotch : Rp 25.000

### 🍵 MATCHA
- Matcha latte : Rp 25.000
- Strawberry matcha : Rp 27.000

### 🥤 NON COFFEE
- Red velvet : Rp 22.000
- Chocolate creamy : Rp 22.000
- Dark chocolate : Rp 22.000
- Korean strawberry milk : Rp 23.000

### 🫖 TEA
- Strawberry tea : Rp 17.000
- Lychee tea : Rp 17.000
- Peach tea : Rp 16.000
- Lemon tea : Rp 16.000
- Teh Tarik Malaysia : Rp 16.000

### 🍟 SNACK
- Roti bakar kaya : Rp 10.000
- Roti bakar richeese : Rp 15.000
- Mantou : Rp 15.000
- Kentang goreng : Rp 16.000
- Sosis/nugget : Rp 16.000
- Special Mix Platter (*Kentang, Sosis, Nugget, Onion ring, Chicken Wing*) : Rp 37.000

### 🍛 FOOD
- Ayam sambal terasi : Rp 25.000
- Ayam saos padang : Rp 26.000
- Nugget chicken curry : Rp 26.000
- Nasi Goreng Telur : Rp 23.000
- Nasi Goreng Ayam : Rp 25.000
- Indomie goreng : Rp 15.000
- Indomie rebus : Rp 15.000

### ➕ ADDITIONAL (Add-ons / Topping)
- Es kosong : Rp 2.000
- Espresso shot : Rp 5.000
- Extra syrup : Rp 5.000
- Air mineral : Rp 5.000
- Nasi putih : Rp 5.000
- Telur : Rp 5.000

---

## Don'ts
- Jangan gunakan gradient warna-warni yang mencolok; pertahankan nuansa navy blue & putih bersih yang mewah khas DORE.
- Hindari form login untuk customer meja (customer harus bisa langsung pesan tanpa registrasi).
- Jangan buat tombol aksi kecil di mobile (target sentuh minimum 44px x 44px).
- Jangan tampilkan navigasi admin di layar customer meja.
- Hindari shadow tebal / blur berlebihan (gunakan `shadow-sm` atau border tipis `#E2E8F0`).
