import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

interface JwtPayload {
    userId: string;
}

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    const token = authorization.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(500).json({
            success: false,
            message: "JWT_SECRET is not configured",
        });
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;

        req.userId = payload.userId;

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}