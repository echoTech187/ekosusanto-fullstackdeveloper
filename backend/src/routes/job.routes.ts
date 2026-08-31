import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { validate } from '../middlewares/validate.middleware';
import { createJobSchema } from '../validators/job.validator';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();
const controller = new JobController();

router.get('/', (req, res, next) => controller.getAllJobs(req, res, next));
router.get('/company', authenticateToken, authorizeRoles(Role.COMPANY), (req, res, next) => controller.getCompanyJobs(req, res, next));
router.get('/:id', (req, res, next) => controller.getJobById(req, res, next));
router.post('/', authenticateToken, authorizeRoles(Role.COMPANY), validate(createJobSchema), (req, res, next) => controller.createJob(req, res, next));

export default router;
