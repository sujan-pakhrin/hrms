import Department from '../models/department.model.js';
import Employee from '../models/employee.model.js';

export const createDepartment = async (req, res) => {
    try {
        const { name, description, managerId } = req.body;

        // Verify manager exists
        const manager = await Employee.findById(managerId);
        if (!manager) {
            return res.status(400).json({ message: "Manager not found" });
        }

        const department = new Department({
            name,
            description,
            managerId
        });

        await department.save();

        res.status(201).json({
            message: "Department created successfully",
            department
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({
            message: "Departments fetched successfully",
            departments
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({
            message: "Department fetched successfully",
            department
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.managerId) {
            const manager = await Employee.findById(updates.managerId);
            if (!manager) {
                return res.status(400).json({ message: "Manager not found" });
            }
        }

        const department = await Department.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({
            message: "Department updated successfully",
            department
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};