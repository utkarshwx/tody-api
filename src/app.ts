import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import goalRoutes from "./routes/goal.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        success: true,
        service: "tody-api",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/goals", goalRoutes);
app.use("/api/v1/tasks", taskRoutes);

export default app;