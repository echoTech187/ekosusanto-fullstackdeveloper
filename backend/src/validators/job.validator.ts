import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Judul pekerjaan minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi pekerjaan minimal 10 karakter'),
  companyName: z.string().min(2, 'Nama perusahaan minimal 2 karakter'),
  location: z.string().min(2, 'Lokasi minimal 2 karakter'),
  salary: z.string().min(1, 'Gaji wajib diisi'),
  jobType: z.string().min(1, 'Tipe pekerjaan wajib diisi (Contoh: Full-time, Remote, Contract)'),
});
