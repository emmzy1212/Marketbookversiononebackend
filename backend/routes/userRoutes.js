import express from 'express';
import {
  registerUser,
  registerAdmin,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserNotifications,
  markNotificationRead,
  getAuditLogs,
  getDashboardStats,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get('/notifications', protect, getUserNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.get('/audit-logs', protect, admin, getAuditLogs);
router.get('/dashboard-stats', protect, admin, getDashboardStats);
router.get('/', protect, admin, getAllUsers);

export default router;