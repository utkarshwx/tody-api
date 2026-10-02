import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

import { User } from "../models/User";

import {
    AuthenticatedRequest,
} from "../middleware/auth.middleware";

export async function register(req: Request, res: Response) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        const user = await registerUser(email, password, name);

        const result = await loginUser(email, password);

        return res.status(201).json({
            success: true,
            token: result.token,
            user: user,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to register user",
        });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const result = await loginUser(email, password);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to login",
        });
    }
}

export async function me(
    req: AuthenticatedRequest,
    res: Response
) {
    const user = await User.findById(req.userId).select(
        "email name createdAt updatedAt"
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        success: true,
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        },
    });
}