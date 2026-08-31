"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const prisma_1 = require("../config/prisma");
class JobRepository {
    async findAll(search, jobType) {
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (jobType && jobType !== 'ALL') {
            where.jobType = jobType;
        }
        return prisma_1.prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                company: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { applications: true },
                },
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.job.findUnique({
            where: { id },
            include: {
                company: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { applications: true },
                },
            },
        });
    }
    async findByCompanyId(companyId) {
        return prisma_1.prisma.job.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true },
                },
            },
        });
    }
    async create(data) {
        return prisma_1.prisma.job.create({
            data,
        });
    }
}
exports.JobRepository = JobRepository;
