import express from 'express';
import {
  createProject,
  getProjectData,
  getTaskById,
} from '../controllers/project.controller.js';

import { protect, permissionsOne } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/:projectId', protect, permissionsOne, getProjectData);
router.get('/getTask/:projectId/:taskId', protect, permissionsOne, getTaskById);

export default router;