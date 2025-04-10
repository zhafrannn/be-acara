import express from "express";
import authController from "../controllers/auth.controller";
import dummyController from "../controllers/dummy.controller";

import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
router.get("/dummy", dummyController.dummy);



export default router;