import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
    createGoal,
    getGoals,
    getGoal,
    updateGoal,
    deleteGoal,
} from "../controllers/goal.controller";

const router = Router();

router.use(authenticate);

router.post("/", createGoal);
router.get("/", getGoals);
router.get("/:id", getGoal);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;