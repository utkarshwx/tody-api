import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { Goal } from "../models/Goals";

export async function createGoal(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const { title, description, period, startDate, endDate } = req.body;

        if (!title || !period) {
            return res.status(400).json({
                success: false,
                message: "Title and period are required",
            });
        }

        const goal = await Goal.create({
            userId: req.userId,
            title,
            description,
            period,
            startDate,
            endDate,
        });

        return res.status(201).json({
            success: true,
            goal,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create goal",
        });
    }
}

export async function getGoals(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const { period, status } = req.query;

        const filter: Record<string, unknown> = {
            userId: req.userId,
        };

        if (period) filter.period = period;
        if (status) filter.status = status;

        const goals = await Goal.find(filter).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            goals,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch goals",
        });
    }
}

export async function getGoal(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            goal,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch goal",
        });
    }
}

export async function updateGoal(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const { title, description, period, startDate, endDate, status } =
            req.body;

        const goal = await Goal.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId,
            },
            {
                $set: {
                    title,
                    description,
                    period,
                    startDate,
                    endDate,
                    status,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            goal,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update goal",
        });
    }
}

export async function deleteGoal(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Goal deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete goal",
        });
    }
}