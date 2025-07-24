import User from '../models/user.model.js';
import Employee from '../models/employee.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password, role, employeeData } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create user
        const user = new User({
            username,
            email,
            passwordHash: hashedPassword,
            role,
            isTempPassword: true,
            requiresPasswordReset: true
        });

        await user.save();

        // Create employee record if employeeData is provided
        if (employeeData && role === 'employee') {
            const employee = new Employee({
                userId: user._id,
                ...employeeData
            });
            await employee.save();
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        // Prepare response
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        // Prepare response
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        // Verify current password
        const isPasswordValid = bcrypt.compareSync(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Update password
        user.passwordHash = hashedPassword;
        user.isTempPassword = false;
        user.requiresPasswordReset = false;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};