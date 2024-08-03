import { Session } from "../models/session.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSession = asyncHandler(async (req, res) => {
  try {
    const session = Session.create({
      userId: req.user._id,
      ipAddress,
    });
    res
      .status(200)
      .json(new ApiResponse(200, session, "session created successfully"));
  } catch (error) {}
});

const getSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id });
  if (!sessions) {
    throw new ApiError(500, "coulnot get sessions try again");
  }
  res
    .status(200)
    .json(new ApiResponse(200, sessions, "sessions fetched successfully"));
});

export { createSession, getSessions };
