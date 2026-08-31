"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Judul pekerjaan minimal 3 karakter'),
    description: zod_1.z.string().min(10, 'Deskripsi pekerjaan minimal 10 karakter'),
    companyName: zod_1.z.string().min(2, 'Nama perusahaan minimal 2 karakter'),
    location: zod_1.z.string().min(2, 'Lokasi minimal 2 karakter'),
    salary: zod_1.z.string().min(1, 'Gaji wajib diisi'),
    jobType: zod_1.z.string().min(1, 'Tipe pekerjaan wajib diisi (Contoh: Full-time, Remote, Contract)'),
});
