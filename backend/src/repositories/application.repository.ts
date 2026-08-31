import { prisma } from '../config/prisma';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationRepository {
  async findExisting(jobId: string, seekerId: string) {
    return prisma.application.findUnique({
      where: {
        unique_job_seeker_application: {
          jobId,
          seekerId,
        },
      },
    });
  }

  async create(jobId: string, seekerId: string) {
    return prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          jobId,
          seekerId,
          status: ApplicationStatus.APPLIED,
        },
      });

      await tx.applicationHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: null,
          toStatus: ApplicationStatus.APPLIED,
          changedById: seekerId,
          notes: 'Melamar lowongan pekerjaan ini.',
        },
      });

      return application;
    });
  }

  async findBySeekerId(seekerId: string) {
    return prisma.application.findMany({
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

  async findByJobId(jobId: string) {
    return prisma.application.findMany({
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

  async findById(id: string) {
    return prisma.application.findUnique({
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

  async updateStatus(
    applicationId: string,
    fromStatus: ApplicationStatus,
    toStatus: ApplicationStatus,
    changedById: string,
    notes?: string
  ) {
    return prisma.$transaction(async (tx) => {
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
