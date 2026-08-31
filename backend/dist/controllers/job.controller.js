"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const job_service_1 = require("../services/job.service");
const jobService = new job_service_1.JobService();
class JobController {
    async getAllJobs(req, res, next) {
        try {
            const search = req.query.search;
            const jobType = req.query.jobType;
            const jobs = await jobService.getAllJobs(search, jobType);
            res.status(200).json({
                success: true,
                data: jobs,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getJobById(req, res, next) {
        try {
            const { id } = req.params;
            const job = await jobService.getJobById(id);
            res.status(200).json({
                success: true,
                data: job,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCompanyJobs(req, res, next) {
        try {
            const companyId = req.user.userId;
            const jobs = await jobService.getCompanyJobs(companyId);
            res.status(200).json({
                success: true,
                data: jobs,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createJob(req, res, next) {
        try {
            const companyId = req.user.userId;
            const newJob = await jobService.createJob({
                ...req.body,
                companyId,
            });
            res.status(201).json({
                success: true,
                message: 'Lowongan pekerjaan berhasil dibuat.',
                data: newJob,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.JobController = JobController;
