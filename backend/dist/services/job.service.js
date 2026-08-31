"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const job_repository_1 = require("../repositories/job.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
const jobRepo = new job_repository_1.JobRepository();
class JobService {
    async getAllJobs(search, jobType) {
        return jobRepo.findAll(search, jobType);
    }
    async getJobById(id) {
        const job = await jobRepo.findById(id);
        if (!job) {
            throw new error_middleware_1.AppError('Lowongan pekerjaan tidak ditemukan.', 404);
        }
        return job;
    }
    async getCompanyJobs(companyId) {
        return jobRepo.findByCompanyId(companyId);
    }
    async createJob(data) {
        return jobRepo.create(data);
    }
}
exports.JobService = JobService;
