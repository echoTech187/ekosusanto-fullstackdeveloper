"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const application_repository_1 = require("../repositories/application.repository");
const job_repository_1 = require("../repositories/job.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
const appRepo = new application_repository_1.ApplicationRepository();
const jobRepo = new job_repository_1.JobRepository();
class ApplicationService {
    async applyJob(jobId, seekerId) {
        const job = await jobRepo.findById(jobId);
        if (!job) {
            throw new error_middleware_1.AppError('Lowongan pekerjaan tidak ditemukan.', 404);
        }
        const existingApp = await appRepo.findExisting(jobId, seekerId);
        if (existingApp) {
            throw new error_middleware_1.AppError('Anda sudah melamar pekerjaan ini sebelumnya dan tidak dapat melamar lebih dari satu kali.', 400);
        }
        return appRepo.create(jobId, seekerId);
    }
    async getMyApplications(seekerId) {
        return appRepo.findBySeekerId(seekerId);
    }
    async getJobCandidates(jobId, companyId) {
        const job = await jobRepo.findById(jobId);
        if (!job) {
            throw new error_middleware_1.AppError('Lowongan pekerjaan tidak ditemukan.', 404);
        }
        if (job.companyId !== companyId) {
            throw new error_middleware_1.AppError('Anda tidak memiliki akses untuk melihat kandidat lowongan ini.', 403);
        }
        return appRepo.findByJobId(jobId);
    }
    async updateCandidateStatus(applicationId, companyId, toStatus, notes) {
        const application = await appRepo.findById(applicationId);
        if (!application) {
            throw new error_middleware_1.AppError('Lamaran pekerjaan tidak ditemukan.', 404);
        }
        if (application.job.companyId !== companyId) {
            throw new error_middleware_1.AppError('Anda tidak memiliki akses untuk mengelola lamaran ini.', 403);
        }
        if (application.status === toStatus) {
            throw new error_middleware_1.AppError(`Status lamaran sudah '${toStatus}'.`, 400);
        }
        return appRepo.updateStatus(applicationId, application.status, toStatus, companyId, notes);
    }
    async getApplicationDetails(applicationId, userId) {
        const application = await appRepo.findById(applicationId);
        if (!application) {
            throw new error_middleware_1.AppError('Lamaran pekerjaan tidak ditemukan.', 404);
        }
        // Must be either the seeker who applied or the company who owns the job
        if (application.seekerId !== userId && application.job.companyId !== userId) {
            throw new error_middleware_1.AppError('Anda tidak memiliki hak akses melihat detail lamaran ini.', 403);
        }
        return application;
    }
}
exports.ApplicationService = ApplicationService;
