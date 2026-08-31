import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

export const applyJobSchema = z.object({
  jobId: z.string().uuid('ID Job tidak valid'),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus, {
    errorMap: () => ({ message: 'Status harus salah satu dari: APPLIED, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED' }),
  }),
  notes: z.string().optional(),
});
