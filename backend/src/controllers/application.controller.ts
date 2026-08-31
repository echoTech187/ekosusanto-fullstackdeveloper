import { Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';
import { AuthRequest } from '../types';

const appService = new ApplicationService();

export class ApplicationController {
  async applyJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seekerId = req.user!.userId;
      const { jobId } = req.body;
      const application = await appService.applyJob(jobId, seekerId);
      res.status(201).json({
        success: true,
        message: 'Berhasil melamar pekerjaan.',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyApplications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seekerId = req.user!.userId;
      const applications = await appService.getMyApplications(seekerId);
      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobCandidates(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const { jobId } = req.params;
      const candidates = await appService.getJobCandidates(jobId, companyId);
      res.status(200).json({
        success: true,
        data: candidates,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCandidateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedApp = await appService.updateCandidateStatus(id, companyId, status, notes);
      res.status(200).json({
        success: true,
        message: `Status kandidat berhasil diperbarui menjadi ${status}.`,
        data: updatedApp,
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const details = await appService.getApplicationDetails(id, userId);
      res.status(200).json({
        success: true,
        data: details,
      });
    } catch (error) {
      next(error);
    }
  }
}
