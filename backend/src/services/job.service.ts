import { JobRepository } from '../repositories/job.repository';
import { AppError } from '../middlewares/error.middleware';

const jobRepo = new JobRepository();

export class JobService {
  async getAllJobs(search?: string, jobType?: string) {
    return jobRepo.findAll(search, jobType);
  }

  async getJobById(id: string) {
    const job = await jobRepo.findById(id);
    if (!job) {
      throw new AppError('Lowongan pekerjaan tidak ditemukan.', 404);
    }
    return job;
  }

  async getCompanyJobs(companyId: string) {
    return jobRepo.findByCompanyId(companyId);
  }

  async createJob(data: {
    title: string;
    description: string;
    companyName: string;
    location: string;
    salary: string;
    jobType: string;
    companyId: string;
  }) {
    return jobRepo.create(data);
  }
}
