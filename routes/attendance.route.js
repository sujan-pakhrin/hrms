import express from 'express';
import {
    getAttendanceRecords,
    getMyAttendance,
    clockIn,
    clockOut
} from '../controller/attendance.controller.js';
import { protect, managerOrAdmin } from '../middleware/verify.token.js';

const router = express.Router();

router.get('/', protect, managerOrAdmin, getAttendanceRecords);
router.get('/my-attendance', protect, getMyAttendance);
router.post('/clock-in', protect, clockIn);
router.post('/clock-out', protect, clockOut);

export default router;