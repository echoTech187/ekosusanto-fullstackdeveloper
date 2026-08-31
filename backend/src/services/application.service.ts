import { ApplicationStatus } from '@prisma/client';
import { ApplicationRepository } from '../repositories/application.repository';
import { JobRepository } from '../repositories/job.repository';
import { AppError } from '../middlewares/error.middleware';

const appRepo = new ApplicationRepository();
const jobRepo = new JobRepository();

export class ApplicationService {
  async applyJob(jobId: string, seekerId: string) {
    const job = await jobRepo.findById(jobId);
    if (!job) {
      throw new AppError('Lowongan pekerjaan tidak ditemukan.', 404);
    }

    const existingApp = await appRepo.findExisting(jobId, seekerId);
    if (existingApp) {
      throw new AppError('Anda sudah melamar pekerjaan ini sebelumnya dan tidak dapat melamar lebih dari satu kali.', 400);
    }

    return appRepo.create(jobId, seekerId);
  }

  async getMyApplications(seekerId: string) {
    return appRepo.findBySeekerId(seekerId);
  }

  async getJobCandidates(jobId: string, companyId: string) {
    const job = await jobRepo.findById(jobId);
    if (!job) {
      throw new AppError('Lowongan pekerjaan tidak ditemukan.', 404);
    }

    if (job.companyId !== companyId) {
      throw new AppError('Anda tidak memiliki akses untuk melihat kandidat lowongan ini.', 403);
    }

    return appRepo.findByJobId(jobId);
  }

  async updateCandidateStatus(
    applicationId: string,
    companyId: string,
    toStatus: ApplicationStatus,
    notes?: string
  ) {
    const application = await appRepo.findById(applicationId);
    if (!application) {
      throw new AppError('Lamaran pekerjaan tidak ditemukan.', 404);
    }

    if (application.job.companyId !== companyId) {
      throw new AppError('Anda tidak memiliki akses untuk mengelola lamaran ini.', 403);
    }

    if (application.status === toStatus) {
      throw new AppError(`Status lamaran sudah '${toStatus}'.`, 400);
    }

    return appRepo.updateStatus(
      applicationId,
      application.status,
      toStatus,
      companyId,
      notes
    );
  }

  async getApplicationDetails(applicationId: string, userId: string) {
    const application = await appRepo.findById(applicationId);
    if (!application) {
      throw new AppError('Lamaran pekerjaan tidak ditemukan.', 404);
    }

    // Must be either the seeker who applied or the company who owns the job
    if (application.seekerId !== userId && application.job.companyId !== userId) {
      throw new AppError('Anda tidak memiliki hak akses melihat detail lamaran ini.', 403);
    }

    return application;
  }
}
