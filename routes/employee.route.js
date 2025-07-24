import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from '../controller/employee.controller.js';
import { protect, admin, managerOrAdmin, selfOrManagerOrAdmin } from '../middleware/verify.token.js';

const router = express.Router();

// All routes protected
router.use(protect);

router.post('/', admin, createEmployee);
router.get('/', managerOrAdmin, getEmployees);
router.get('/:id', selfOrManagerOrAdmin, getEmployeeById);
router.put('/:id', selfOrManagerOrAdmin, updateEmployee);
router.delete('/:id', admin, deleteEmployee);

export default router