import express from 'express';

import  {authUser,
    registerUser,
    confirmEmail,
    resendEmail,
    getUserByNameOrEmail,
    getUserData,
    markNotification,
    getNotification,
    discardNotification,
    updateProjectColorTheme,
    updateProjectBackgroundColor
} from '../controllers/user.controller.js';

import { protect, permissionsOne } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/confirm', confirmEmail);
router.post('/resend', resendEmail);
router.post('/find/:projectId', protect, permissionsOne, getUserByNameOrEmail);
router.put('/markNotifications', protect, markNotification);
router.put('/projectColorTheme', protect, updateProjectColorTheme);
router.put('/projectBgColorTheme', protect, updateProjectBackgroundColor);
router.get('/notifications', protect, getNotification);
router.get('/', protect, getUserData);
router.delete('/:notificationId', protect, discardNotification);

export default router;