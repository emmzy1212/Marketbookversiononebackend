import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getAllItemsAdmin,
  getItemStats,
  getFinancialSummary,
  getItemsByPaymentStatus,
} from '../controllers/itemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getItems)
  .post(protect, upload.array('mediaFiles', 5), createItem);

router.route('/admin/all')
  .get(protect, admin, getAllItemsAdmin);

router.route('/stats')
  .get(protect, admin, getItemStats);

router.route('/financial-summary')
  .get(protect, getFinancialSummary);

router.route('/by-payment-status/:status')
  .get(protect, getItemsByPaymentStatus);

router.route('/:id')
  .get(protect, getItemById)
  .put(protect, upload.array('mediaFiles', 5), updateItem)
  .delete(protect, deleteItem);

export default router;