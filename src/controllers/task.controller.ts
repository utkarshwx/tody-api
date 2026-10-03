import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { Task } from "../models/Tasks";

export async function createTask(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const {
            title,
            description,
            resourceUrl,
            goalId,
            priority,
            period,
            dueDate,
        } = req.body;

        if (!title || !period) {
            return res.status(400).json({
                success: false,
                message: "Title and period are required",
            });
        }

        const task = await Task.create({
            userId: req.userId,
            title,
            description,
            resourceUrl,
            goalId,
            priority,
            period,
            dueDate,
        });

        return res.status(201).json({
            success: true,
            task,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create task",
        });
    }
}

export async function getTasks(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const { period, status, priority, goalId } = req.query;

        const page = Math.max(
            Number.parseInt(req.query.page as string) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number.parseInt(req.query.limit as string) || 20,
                1
            ),
            50
        );

        const filter: Record<string, unknown> = {
            userId: req.userId,
        };

        if (period) filter.period = period;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (goalId) filter.goalId = goalId;

        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .populate("goalId", "title period")
                .skip(skip)
                .limit(limit),

            Task.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
        });
    }
}

export async function getTask(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId,
        }).populate("goalId", "title period");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch task",
        });
    }
}

export async function updateTask(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const {
            title,
            description,
            resourceUrl,
            goalId,
            priority,
            period,
            status,
            dueDate,
        } = req.body;

        const updateData: Record<string, unknown> = {
            title,
            description,
            resourceUrl,
            goalId,
            priority,
            period,
            status,
            dueDate,
        };

        if (status === "COMPLETED") {
            updateData.completedAt = new Date();
        }

        if (status && status !== "COMPLETED") {
            updateData.completedAt = null;
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId,
            },
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update task",
        });
    }
}

export async function deleteTask(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete task",
        });
    }
}