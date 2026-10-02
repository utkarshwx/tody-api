import mongoose, { Document, Schema } from "mongoose";

export type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "COMPLETED";

export type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH";

export type TaskPeriod =
    | "YEAR"
    | "MONTH"
    | "WEEK"
    | "DAY";

export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;
    goalId?: mongoose.Types.ObjectId;

    title: string;
    description?: string;
    resourceUrl?: string;

    status: TaskStatus;
    priority: TaskPriority;

    period: TaskPeriod;

    dueDate?: Date;
    completedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        goalId: {
            type: Schema.Types.ObjectId,
            ref: "Goal",
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },

        resourceUrl: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
            default: "TODO",
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },

        period: {
            type: String,
            enum: ["YEAR", "MONTH", "WEEK", "DAY"],
            required: true,
        },

        dueDate: Date,

        completedAt: Date,
    },
    {
        timestamps: true,
    }
);

taskSchema.index({
    userId: 1,
    period: 1,
    status: 1,
});

export const Task = mongoose.model<ITask>("Task", taskSchema);