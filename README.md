# DORE Coffee & Pastry — POS & Table Self-Ordering System

Sistem Point of Sale (POS) dan Self-Ordering terintegrasi untuk tugas kuliah bertema kafe **DORE Coffee & Pastry**.

---

## 🚀 Cara Menjalankan Project

### Cara 1 (Paling Mudah):
Cukup **double-click** file:
👉 `run.bat`

### Cara 2 (Via Terminal / PowerShell):
```powershell
$env:PATH = "C:\Users\ceilo\Documents\tools\node;" + $env:PATH
node server.js
```

Server akan aktif di port **3000**.

---

## 🌐 Alamat / URL Sistem

| Portal | URL Akses | Deskripsi |
|---|---|---|
| **Customer (Meja 04)** | [http://localhost:3000/?table=04](http://localhost:3000/?table=04) | Menu pelanggan via scan QR meja (bisa ganti nomor meja dengan mengubah angka di URL). |
| **Admin & Kasir** | [http://localhost:3000/admin.html](http://localhost:3000/admin.html) | Dashboard Kasir, Live Kitchen, POS Walk-in, bayar Tunai/QRIS & cetak struk. |
| **Login Kasir** | [http://localhost:3000/login.html](http://localhost:3000/login.html) | Halaman login staff kasir (User: `admin` / Pass: `password123`). |

---

## 📋 Alur Skenario Demo untuk Presentasi Tugas Kuliah

1. **Simulasi Scan QR Meja oleh Pelanggan**:
   * Buka browser di [http://localhost:3000/?table=04](http://localhost:3000/?table=04) (bisa dibuka di HP atau inspect mode HP).
   * Nomor meja otomatis terkunci di **Meja 04**.
   * Pilih menu (misal: *Kopi Susu Aren*, *Americano*, atau *Special Mix Platter*).
   * Kustomisasi suhu (*Ice/Hot*), tingkat gula (*Normal/Less/No Sugar*), dan add-on.
   * Masukkan nama pemesan, lalu klik **Kirim Pesanan ke Kasir**.
   * Layar otomatis berpindah ke **Live Order Tracking** (#DOR-XXX) dengan 3 tahapan live stepper.

2. **Sisi Kasir / Kitchen (Real-Time)**:
   * Buka tab lain di [http://localhost:3000/admin.html](http://localhost:3000/admin.html).
   * Pesanan dari Meja 04 langsung muncul dengan bunyi notifikasi (**Audio Alert**).
   * Klik tombol **Terima & Buat** ➔ status di layar pelanggan otomatis berubah menjadi *"Sedang Diracik Barista"*.
   * Klik **Tandai Siap Saji** ➔ status di layar pelanggan otomatis berubah menjadi *"Siap Disajikan"*.
   * Klik **Proses Bayar** ➔ pilih **Tunai** (kalkulator kembalian otomatis) atau **QRIS**.
   * Klik **Selesaikan & Cetak Struk** ➔ struk kasir thermal 58mm langsung siap cetak/disimpan.

3. **Fitur Tambahan untuk Nilai Plus Tugas Kuliah**:
   * **Manajemen Meja & QR**: Generate barcode QR untuk Meja 01 s/d Meja 12 yang siap diprint dan ditempel di meja kafe.
   * **Manajemen Menu**: Data 41 produk asli dari pamflet menu DORE.
   * **Laporan Penjualan**: Rekapitulasi omset, total transaksi, dan 5 menu terlaris hari ini.
