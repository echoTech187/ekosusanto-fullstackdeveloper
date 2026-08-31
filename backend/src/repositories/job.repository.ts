import { prisma } from '../config/prisma';

export class JobRepository {
  async findAll(search?: string, jobType?: string) {
    const where: any = {};

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

    return prisma.job.findMany({
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

  async findById(id: string) {
    return prisma.job.findUnique({
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

  async findByCompanyId(companyId: string) {
    return prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
  }

  async create(data: {
    title: string;
    description: string;
    companyName: string;
    location: string;
    salary: string;
    jobType: string;
    companyId: string;
  }) {
    return prisma.job.create({
      data,
    });
  }
}
