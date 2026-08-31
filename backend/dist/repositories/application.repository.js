"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepository = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
class ApplicationRepository {
    async findExisting(jobId, seekerId) {
        return prisma_1.prisma.application.findUnique({
            where: {
                unique_job_seeker_application: {
                    jobId,
                    seekerId,
                },
            },
        });
    }
    async create(jobId, seekerId) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const application = await tx.application.create({
                data: {
                    jobId,
                    seekerId,
                    status: client_1.ApplicationStatus.APPLIED,
                },
            });
            await tx.applicationHistory.create({
                data: {
                    applicationId: application.id,
                    fromStatus: null,
                    toStatus: client_1.ApplicationStatus.APPLIED,
                    changedById: seekerId,
                    notes: 'Melamar lowongan pekerjaan ini.',
                },
            });
            return application;
        });
    }
    async findBySeekerId(seekerId) {
        return prisma_1.prisma.application.findMany({
            where: { seekerId },
            orderBy: { createdAt: 'desc' },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        companyName: true,
                        location: true,
                        salary: true,
                        jobType: true,
                    },
                },
                histories: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async findByJobId(jobId) {
        return prisma_1.prisma.application.findMany({
            where: { jobId },
            orderBy: { createdAt: 'desc' },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        companyName: true,
                        location: true,
                        salary: true,
                        jobType: true,
                    },
                },
                seeker: {
                    select: { id: true, name: true, email: true },
                },
                histories: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.application.findUnique({
            where: { id },
            include: {
                job: true,
                seeker: true,
                histories: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async updateStatus(applicationId, fromStatus, toStatus, changedById, notes) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const updatedApp = await tx.application.update({
                where: { id: applicationId },
                data: { status: toStatus },
            });
            await tx.applicationHistory.create({
                data: {
                    applicationId,
                    fromStatus,
                    toStatus,
                    changedById,
                    notes: notes || `Status diubah menjadi ${toStatus}`,
                },
            });
            return updatedApp;
        });
    }
}
exports.ApplicationRepository = ApplicationRepository;
