import express from 'express';
import { 
    getCurrentUser, 
    getAllUsers, 
    updateUser, 
    deactivateUser 
} from '../controller/user.controller.js';
import { protect, admin, managerOrAdmin, selfOrAdmin } from '../middleware/verify.token.js';

const router = express.Router();

// All routes protected
router.use(protect);

router.get('/me', getCurrentUser);
router.get('/', managerOrAdmin, getAllUsers);
router.get('/:id', selfOrAdmin, getCurrentUser);
router.put('/:id', selfOrAdmin, updateUser);
router.delete('/:id', admin, deactivateUser);

export default router;