import express from 'express';
import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment
} from '../controller/department.controller.js';
import { protect, admin } from '../middleware/verify.token.js';

const router = express.Router();

router.post('/', protect, admin, createDepartment);
router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartmentById);
router.put('/:id', protect, admin, updateDepartment);

export default router;