import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSessions } from "../controllers/session.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getSessions);

export default router;
