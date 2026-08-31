import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';
import { AuthRequest } from '../types';

const jobService = new JobService();

export class JobController {
  async getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const jobType = req.query.jobType as string | undefined;
      const jobs = await jobService.getAllJobs(search, jobType);
      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const job = await jobService.getJobById(id);
      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyJobs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const jobs = await jobService.getCompanyJobs(companyId);
      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  async createJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const newJob = await jobService.createJob({
        ...req.body,
        companyId,
      });
      res.status(201).json({
        success: true,
        message: 'Lowongan pekerjaan berhasil dibuat.',
        data: newJob,
      });
    } catch (error) {
      next(error);
    }
  }
}
