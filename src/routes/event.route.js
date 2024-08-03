import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  deleteEvent,
  getUserEvents,
  updateEvent,
} from "../controllers/event.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createEvent);
router.route("/").get(getUserEvents);
router.route("/:eventId").put(updateEvent);
router.route("/:eventId").delete(deleteEvent);
export default router;
