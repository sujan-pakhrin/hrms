import express from 'express';
import {
    createLeaveRequest,
    getLeaveRequests,
    getMyLeaveRequests,
    approveLeaveRequest
} from '../controller/leave.request.controller.js';
import { protect, managerOrAdmin } from '../middleware/verify.token.js';

const router = express.Router();

router.post('/', protect, createLeaveRequest);
router.get('/', protect, managerOrAdmin, getLeaveRequests);
router.get('/my-leaves', protect, getMyLeaveRequests);
router.patch('/:id/approve', protect, managerOrAdmin, approveLeaveRequest);

export default router;