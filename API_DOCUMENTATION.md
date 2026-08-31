# Dokumentasi REST API - E-Loker.com Job Application Management

Dokumentasi API lengkap untuk backend aplikasi **E-Loker.com Job Application Management**.

Base URL: `http://localhost:5000/api`

---

## Headers & Otentikasi
Untuk endpoint yang memerlukan otentikasi (Protected), sertakan header JWT Token:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Otentikasi & Akun (`/auth`)

### a. Register User Baru
- **Endpoint**: `POST /auth/register`
- **Akses**: Publik
- **Request Body**:
```json
{
  "email": "pelamar@gmail.com",
  "password": "password123",
  "name": "Budi Santoso",
  "role": "JOB_SEEKER" // Opsi: "JOB_SEEKER" atau "COMPANY"
}
```
- **Response Success (201 Created)**:
```json
{
  "success": true,
  "message": "Registrasi berhasil.",
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "pelamar@gmail.com",
      "name": "Budi Santoso",
      "role": "JOB_SEEKER",
      "createdAt": "2026-08-31T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
}
```

### b. Login User
- **Endpoint**: `POST /auth/login`
- **Akses**: Publik
- **Request Body**:
```json
{
  "email": "hr@techcorp.id",
  "password": "password123"
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": "uuid-company",
      "email": "hr@techcorp.id",
      "name": "TechCorp Indonesia",
      "role": "COMPANY"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
}
```

### c. Get Current User Profile
- **Endpoint**: `GET /auth/me`
- **Akses**: Protected (Semua Role)

---

## 2. Lowongan Pekerjaan (`/jobs`)

### a. Daftar Semua Lowongan (Pencarian & Filter)
- **Endpoint**: `GET /jobs`
- **Akses**: Publik
- **Query Parameters**:
  - `search` (opsional): kata kunci judul, nama perusahaan, atau lokasi
  - `jobType` (opsional): `Full-time`, `Part-time`, `Remote`, `Hybrid`, `Contract`
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "job-uuid-1",
      "title": "Full Stack Developer",
      "description": "Pengalaman Node.js dan React...",
      "companyName": "TechCorp Indonesia",
      "location": "Jakarta Selatan (Hybrid)",
      "salary": "Rp 12.000.000 - Rp 18.000.000",
      "jobType": "Full-time",
      "companyId": "uuid-company",
      "createdAt": "2026-08-31T10:00:00.000Z",
      "_count": {
        "applications": 3
      }
    }
  ]
}
```

### b. Buat Lowongan Baru
- **Endpoint**: `POST /jobs`
- **Akses**: Protected (`COMPANY` sahaja)
- **Request Body**:
```json
{
  "title": "Senior Frontend Engineer",
  "description": "Menguasai React.js, TypeScript, dan Vite...",
  "companyName": "TechCorp Indonesia",
  "location": "Bandung (Remote)",
  "salary": "Rp 15.000.000 - Rp 22.000.000",
  "jobType": "Full-time"
}
```

### c. Daftar Lowongan Perusahaan Saya
- **Endpoint**: `GET /jobs/company`
- **Akses**: Protected (`COMPANY` sahaja)

---

## 3. Lamaran & Kandidat (`/applications`)

### a. Lamar Pekerjaan
- **Endpoint**: `POST /applications/apply`
- **Akses**: Protected (`JOB_SEEKER` sahaja)
- **Constraint**: Menolak jika pelamar sudah pernah melamar pekerjaan yang sama.
- **Request Body**:
```json
{
  "jobId": "job-uuid-1"
}
```

### b. Daftar Pekerjaan Yang Saya Lamar
- **Endpoint**: `GET /applications/my-applications`
- **Akses**: Protected (`JOB_SEEKER` sahaja)
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "app-uuid-1",
      "jobId": "job-uuid-1",
      "seekerId": "seeker-uuid-1",
      "status": "REVIEWING",
      "createdAt": "2026-08-31T10:00:00.000Z",
      "job": {
        "title": "Full Stack Developer",
        "companyName": "TechCorp Indonesia",
        "location": "Jakarta Selatan (Hybrid)",
        "salary": "Rp 12.000.000 - Rp 18.000.000",
        "jobType": "Full-time"
      },
      "histories": [
        {
          "id": "hist-1",
          "fromStatus": null,
          "toStatus": "APPLIED",
          "notes": "Melamar lowongan pekerjaan ini.",
          "createdAt": "2026-08-31T10:00:00.000Z"
        },
        {
          "id": "hist-2",
          "fromStatus": "APPLIED",
          "toStatus": "REVIEWING",
          "notes": "Berkas CV sedang ditinjau HR.",
          "createdAt": "2026-08-31T11:00:00.000Z"
        }
      ]
    }
  ]
}
```

### c. Daftar Kandidat Pelamar Lowongan (Khusus Perusahaan)
- **Endpoint**: `GET /applications/job/:jobId/candidates`
- **Akses**: Protected (`COMPANY` sahaja & pemilik lowongan)

### d. Ubah Status Kandidat & Catat Riwayat Audit
- **Endpoint**: `PATCH /applications/:id/status`
- **Akses**: Protected (`COMPANY` sahaja & pemilik lowongan)
- **Request Body**:
```json
{
  "status": "SHORTLISTED", // Opsi: "APPLIED", "REVIEWING", "SHORTLISTED", "REJECTED", "ACCEPTED"
  "notes": "Kandidat lolos tahap interview teknis"
}
```
- **Response Success (200 OK)**:
```json
{
  "success": true,
  "message": "Status kandidat berhasil diperbarui menjadi SHORTLISTED.",
  "data": {
    "id": "app-uuid-1",
    "status": "SHORTLISTED",
    "updatedAt": "2026-08-31T12:00:00.000Z"
  }
}
```
