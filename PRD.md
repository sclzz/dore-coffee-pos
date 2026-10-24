# PRD — DORE Coffee & Pastry POS & Self-Ordering System

## 1. Project Background & Objective
Sistem POS (Point of Sale) untuk kedai kopi **DORE Coffee & Pastry** yang mendukung dua alur pengguna:
1. **Customer Self-Order via QR Meja**: Pelanggan scan QR code di meja (membawa parameter meja misal `/?table=03`), memilih menu dan varian, lalu mengirim pesanan langsung ke kasir/dapur.
2. **Admin & Kasir POS**: Kasir memantau pesanan masuk secara real-time, melayani pesanan langsung di kasir (walk-in/takeaway), memproses pembayaran (Tunai/QRIS), mencetak struk thermal, dan mengelola menu/meja.

---

## 2. Core Functional Requirements

### A. Customer Module (Mobile Web)
- **Table Detection**: Mendeteksi nomor meja dari URL parameter atau token QR.
- **Katalog Menu DORE**:
  - **Coffee**: Americano (15k), Honey Americano (22k), Cranberrycano (21k), Orange Americano (23k), Doremilk Coffee (20k), Kopi Susu Aren (23k), Kopi Susu Pandan (23k), Hazelnut (23k), Salted Caramel (25k), Popcorn Coffee (25k), Butterscotch (25k).
  - **Matcha**: Matcha Latte (25k), Strawberry Matcha (27k).
  - **Non Coffee**: Red Velvet (22k), Chocolate Creamy (22k), Dark Chocolate (22k), Korean Strawberry Milk (23k).
  - **Tea**: Strawberry Tea (17k), Lychee Tea (17k), Peach Tea (16k), Lemon Tea (16k), Teh Tarik Malaysia (16k).
  - **Snack**: Roti Bakar Kaya (10k), Roti Bakar Richeese (15k), Mantou (15k), Kentang Goreng (16k), Sosis/Nugget (16k), Special Mix Platter (37k).
  - **Food**: Ayam Sambal Terasi (25k), Ayam Saos Padang (26k), Nugget Chicken Curry (26k), Nasi Goreng Telur (23k), Nasi Goreng Ayam (25k), Indomie Goreng (15k), Indomie Rebus (15k).
  - **Additional**: Es Kosong (2k), Espresso Shot (5k), Extra Syrup (5k), Air Mineral (5k), Nasi Putih (5k), Telur (5k).
- **Item Customization**: Pilihan Ice/Hot, Tingkat Gula (Normal/Less/No Sugar), Pilihan Add-on, dan Catatan Pesanan.
- **Order Submission**: Input nama pelanggan dan nomor meja, submit pesanan ke kasir.
- **Live Status Tracker**: Pantau tahapan pesanan (Menunggu Konfirmasi → Diproses → Siap Saji).

### B. Admin & Kasir Module (Tablet/Desktop)
- **Autentikasi**: Login akun kasir/admin.
- **Live Order Feed**: Notifikasi pesanan meja masuk, timer antrean, dan tombol ubah status pesanan.
- **POS Kasir (Walk-in)**: Pemesanan langsung di kasir dengan pencarian menu cepat.
- **Metode Pembayaran**:
  - Tunai (Kalkulator kembalian otomatis & tombol uang pas).
  - QRIS (Display QR code pembayaran).
- **Cetak Struk Thermal**: Format standar 58mm dengan nomor nota, detail pesanan, dan tanggal/waktu.
- **Table QR Generator**: Cetak kartu QR meja (Meja 1–20) dengan format display siap print.
- **Menu Management & Laporan**: CRUD menu, switch status stok, dan rekap pendapatan harian.

---

## 3. Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons
- **Backend**: Node.js (Express.js)
- **Database**: SQLite (Zero configuration, file local database)
- **Real-time Communication**: WebSockets / SSE / Short-polling
