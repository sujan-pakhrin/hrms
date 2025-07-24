import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import employeeRoutes from './routes/employee.route.js';
import departmentRoutes from './routes/department.route.js';
import leaveRoutes from './routes/leave.request.route.js';
import attendanceRoutes from './routes/attendance.route.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));