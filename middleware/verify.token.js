import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-passwordHash');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const admin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

export const managerOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};

export const selfOrAdmin = (req, res, next) => {
    const requestedId = req.params.id;
    if (req.user && (req.user.role === 'admin' || req.user._id.toString() === requestedId)) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};

export const selfOrManagerOrAdmin = (req, res, next) => {
    const requestedId = req.params.id;
    if (req.user && (
        req.user.role === 'admin' || 
        req.user.role === 'manager' || 
        req.user._id.toString() === requestedId
    )) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};

export const employeeOnly = (req, res, next) => {
    if (req.user?.role === 'employee') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as employee' });
    }
};

export const managerOnly = (req, res, next) => {
    if (req.user?.role === 'manager') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as manager' });
    }
};