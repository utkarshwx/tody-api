import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
} from "../controllers/task.controller";

const router = Router();

router.use(authenticate);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;