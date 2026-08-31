# E-Loker.com - Job Application Management Platform

Aplikasi Web Full Stack Sederhana & Terstruktur untuk simulasi proses **Job Application Management** pada platform **E-Loker.com**.

Dibuat sesuai dengan spesifikasi **Tes Asesmen E-Loker.com Full Stack Developer**.

---

## 🛠️ Arsitektur & Teknologi

### **Frontend**
- **Framework**: React.js 18 + TypeScript + Vite
- **Styling**: CSS Custom Variables, Modern Glassmorphic Design, Design System & Responsive Layout
- **Icons**: Lucide React
- **HTTP Client**: Axios dengan JWT Interceptors

### **Backend**
- **Runtime & Framework**: Node.js + Express.js + TypeScript
- **ORM & Database**: Prisma ORM + PostgreSQL
- **Otentikasi & Keamanan**: JWT (JSON Web Token), Bcrypt Password Hashing, Role-Based Access Control (RBAC)
- **Input Validation**: Zod Schemas
- **Pattern**: Layered Clean Architecture (`Routes` -> `Middlewares` -> `Controllers` -> `Services` -> `Repositories` -> `Prisma`)

---

## 📋 Fitur Utama Sesuai Spesifikasi

1. **Multi-Role Authentication**: Login & Registrasi sebagai **Job Seeker** atau **Company**.
2. **Daftar Lowongan Pekerjaan**: Menampilkan judul pekerjaan, nama perusahaan, lokasi, rentang gaji, dan tipe pekerjaan (Full-time, Remote, Hybrid, Contract).
3. **Detail & Apply Job**: Pelamar dapat melihat rincian pekerjaan dan melamar secara langsung.
4. **Proteksi Duplikasi Melamar**: Pelamar **tidak dapat melamar pekerjaan yang sama lebih dari 1 kali** (Validasi API + Constraint Unique Prisma).
5. **Dashboard Pelamar**: Menampilkan daftar pekerjaan yang telah dilamar beserta status terkini.
6. **Dashboard Perusahaan**: Perusahaan dapat membuat lowongan baru dan melihat daftar kandidat pelamar pada setiap lowongan miliknya.
7. **Manajemen Status Kandidat**: Perusahaan dapat mengubah status kandidat (`Applied`, `Reviewing`, `Shortlisted`, `Rejected`, `Accepted`).
8. **Audit Trail History Status**: Setiap perubahan status disimpan secara otomatis dalam `ApplicationHistory` beserta catatan HR dan timestamp.
9. **Demo Switcher / Instan Login**: Tombol penguji untuk berpindah peran (Pencari Kerja ↔ Perusahaan) tanpa perlu input password manual!

---

## 🚀 Cara Menjalankan Aplikasi

### **Prasyarat**
- Node.js versi 18+
- PostgreSQL Server (atau Docker)

---

### **1. Persiapan Database (PostgreSQL)**

Gunakan Docker Compose untuk menjalankan PostgreSQL secara instan:
```bash
docker-compose up -d
```
*Atau pastikan PostgreSQL lokal Anda aktif dengan koneksi `postgresql://postgres:postgres@localhost:5432/E-Loker_db?schema=public`.*

---

### **2. Menjalankan Backend**

1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma Client & Migrate Schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Seed Data Uji Coba (Akun Demo & Lowongan Sample):
   ```bash
   npm run prisma:seed
   ```
5. Jalankan server backend versi development:
   ```bash
   npm run dev
   ```
   *Backend REST API akan berjalan di `http://localhost:5000`.*

---

### **3. Menjalankan Frontend**

1. Masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan Vite development server:
   ```bash
   npm run dev
   ```
   *Buka browser Anda di `http://localhost:3000`.*

---

## 🔑 Akun Demo Siap Pakai

Gunakan tombol **"Uji Coba Penguji"** di bagian atas navbar atau login manual dengan kredensial berikut:

| Peran | Email | Password |
|---|---|---|
| **Company (Perusahaan)** | `hr@techcorp.id` | `password123` |
| **Job Seeker (Pelamar)** | `budi@gmail.com` | `password123` |

---

## 📚 Dokumentasi REST API

Penjelasan rinci seluruh endpoint REST API (Request Body, Response Example, & HTTP Status Codes) tersedia pada file [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

---

## 📂 Struktur Direktori Proyek

```text
E-Loker-job-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Model DB (User, Job, Application, ApplicationHistory)
│   │   └── seed.ts             # Script Seeding Data Awal
│   ├── src/
│   │   ├── config/             # Konfigurasi Env & Prisma Client
│   │   ├── controllers/        # Express Route Handlers
│   │   ├── services/           # Logika Bisnis & Validasi Akses
│   │   ├── repositories/       # Abstraksi Database via Prisma
│   │   ├── middlewares/        # Auth JWT, Role RBAC, Zod Validator, Error Handler
│   │   ├── validators/         # Skema Validasi Zod
│   │   ├── routes/             # Definisi Endpoint API
│   │   ├── app.ts              # Setup Express App
│   │   └── server.ts           # Entrypoint HTTP Server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Client Axios + Interceptor Authorization
│   │   ├── components/         # Navbar, JobCard, StatusBadge, Modals
│   │   ├── context/            # AuthContext (State User, Token, & Demo Login)
│   │   ├── pages/              # JobsPage, MyApplicationsPage, CompanyDashboardPage
│   │   ├── App.tsx             # Root Layout & Navigation Switcher
│   │   └── main.tsx            # Entrypoint React Vite
│   └── package.json
├── docker-compose.yml          # PostgreSQL Container Config
├── API_DOCUMENTATION.md        # Spesifikasi Lengkap REST API
└── README.md                   # Petunjuk Menjalankan Aplikasi
```
