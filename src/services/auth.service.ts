import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface JwtPayload {
    userId: string;
}

export async function registerUser(
    email: string,
    password: string,
    name?: string
) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        email,
        passwordHash,
        name,
    });

    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
    };
}

export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        {
            userId: user._id.toString(),
        } satisfies JwtPayload,
        secret,
        {
            expiresIn: "1d",
        }
    );

    return {
        token,
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        },
    };
}