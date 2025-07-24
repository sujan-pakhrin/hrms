import LeaveRequest from '../models/leave.reques.model.js';
import Employee from '../models/employee.model.js';

export const createLeaveRequest = async (req, res) => {
    try {
        const { employedId, leaveType, startDate, endDate, reason } = req.body;

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        // Check if employee exists
        const employee = await Employee.findById(employedId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const leaveRequest = new LeaveRequest({
            employedId,
            leaveType,
            startDate,
            endDate,
            reason,
            status: "pending"
        });

        await leaveRequest.save();

        res.status(201).json({
            message: "Leave request created successfully",
            leaveRequest
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find();
        res.status(200).json({
            message: "Leave requests fetched successfully",
            leaveRequests
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getMyLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({ employedId: req.user._id });
        res.status(200).json({
            message: "Your leave requests fetched successfully",
            leaveRequests
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const approveLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            { 
                status,
                approvedBy: req.user._id 
            },
            { new: true }
        );

        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        res.status(200).json({
            message: "Leave request updated successfully",
            leaveRequest
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};