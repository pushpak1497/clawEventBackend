import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
import userRouter from "./routes/user.route.js";
import eventRouter from "./routes/event.route.js";
import sessionRouter from "./routes/session.route.js";
import weatherservice from "./services/weather.service.js";
import { ApiError } from "./utils/apiError.js";
import { ApiResponse } from "./utils/apiResponse.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/sessions", sessionRouter);

app.get("/api/weather/:location", async (req, res) => {
  try {
    const { location } = req.params;
    const weather = await weatherservice(location);
    res
      .status(200)
      .json(new ApiResponse(200, weather, "weather fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});
export { app };
