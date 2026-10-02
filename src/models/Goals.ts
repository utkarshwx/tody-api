import mongoose, { Document, Schema } from "mongoose";

export type GoalPeriod = "YEAR" | "MONTH" | "WEEK" | "DAY";
export type GoalStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    period: GoalPeriod;
    startDate?: Date;
    endDate?: Date;
    status: GoalStatus;
    createdAt: Date;
    updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
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

        period: {
            type: String,
            enum: ["YEAR", "MONTH", "WEEK", "DAY"],
            required: true,
        },

        startDate: Date,

        endDate: Date,

        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED", "ARCHIVED"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

goalSchema.index({ userId: 1, period: 1 });

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);