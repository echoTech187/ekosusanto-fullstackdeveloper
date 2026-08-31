"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Format email tidak valid'),
    password: zod_1.z.string().min(6, 'Password minimal 6 karakter'),
    name: zod_1.z.string().min(2, 'Nama minimal 2 karakter'),
    role: zod_1.z.nativeEnum(client_1.Role, { errorMap: () => ({ message: 'Role harus JOB_SEEKER atau COMPANY' }) }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Format email tidak valid'),
    password: zod_1.z.string().min(1, 'Password wajib diisi'),
});
