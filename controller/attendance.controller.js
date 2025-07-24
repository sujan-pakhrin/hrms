import Attendance from '../models/attendance.model.js';

export const getAttendanceRecords = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.status(200).json({
            message: "Attendance records fetched successfully",
            attendanceRecords
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getMyAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ employedId: req.user._id });
        res.status(200).json({
            message: "Your attendance records fetched successfully",
            attendanceRecords
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const clockIn = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already clocked in today
        const existingRecord = await Attendance.findOne({
            employedId: req.user._id,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingRecord) {
            return res.status(400).json({ message: "You have already clocked in today" });
        }

        const attendance = new Attendance({
            employedId: req.user._id,
            date: new Date(),
            checkIn: new Date(),
            status: "present"
        });

        await attendance.save();

        res.status(201).json({
            message: "Clock in recorded successfully",
            attendance
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const clockOut = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            employedId: req.user._id,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (!attendance) {
            return res.status(400).json({ message: "You haven't clocked in today" });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: "You have already clocked out today" });
        }

        attendance.checkOut = new Date();
        
        // Check if late (assuming work starts at 9:00 AM)
        const checkInTime = attendance.checkIn.getHours() * 60 + attendance.checkIn.getMinutes();
        if (checkInTime > 9 * 60) {
            attendance.status = "late";
        }

        await attendance.save();

        res.status(200).json({
            message: "Clock out recorded successfully",
            attendance
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};