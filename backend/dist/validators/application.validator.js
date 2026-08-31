"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.applyJobSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.applyJobSchema = zod_1.z.object({
    jobId: zod_1.z.string().uuid('ID Job tidak valid'),
});
exports.updateStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.ApplicationStatus, {
        errorMap: () => ({ message: 'Status harus salah satu dari: APPLIED, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED' }),
    }),
    notes: zod_1.z.string().optional(),
});
