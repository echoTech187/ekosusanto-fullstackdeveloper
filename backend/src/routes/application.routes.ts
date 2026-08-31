import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { validate } from '../middlewares/validate.middleware';
import { applyJobSchema, updateStatusSchema } from '../validators/application.validator';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();
const controller = new ApplicationController();

router.post('/apply', authenticateToken, authorizeRoles(Role.JOB_SEEKER), validate(applyJobSchema), (req, res, next) => controller.applyJob(req, res, next));
router.get('/my-applications', authenticateToken, authorizeRoles(Role.JOB_SEEKER), (req, res, next) => controller.getMyApplications(req, res, next));
router.get('/job/:jobId/candidates', authenticateToken, authorizeRoles(Role.COMPANY), (req, res, next) => controller.getJobCandidates(req, res, next));
router.patch('/:id/status', authenticateToken, authorizeRoles(Role.COMPANY), validate(updateStatusSchema), (req, res, next) => controller.updateCandidateStatus(req, res, next));
router.get('/:id', authenticateToken, (req, res, next) => controller.getApplicationDetails(req, res, next));

export default router;
