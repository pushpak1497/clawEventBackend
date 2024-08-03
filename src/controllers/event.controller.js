import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createEvent = asyncHandler(async (req, res) => {
  const { name, date, location, description } = req.body;
  if (!(name || date || location)) {
    throw new ApiError(401, "All fields are required");
  }
  const event = await Event.create({
    name,
    date,
    location,
    description,
    owner: req.user._id,
  });
  if (!event) {
    throw new ApiError(500, "please try event creating again");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, event, "event created successfully"));
});

const getUserEvents = asyncHandler(async (req, res) => {
  const events = await Event.aggregate([
    {
      $match: {
        owner: req.user?._id,
      },
    },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        events,
        "Events of current user fetched successfully"
      )
    );
});

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { name, date, location, description } = req.body;
  if (!eventId) {
    throw new ApiError(403, "please provide eventId");
  }
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "event not found");
  }
  if (event.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "only owner can make changes");
  }
  const newEvent = await Event.findByIdAndUpdate(
    eventId,
    {
      $set: { name, date, location, description },
    },
    { new: true }
  );
  if (!newEvent) {
    throw new ApiError(500, "issue updating event please try again");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, newEvent, "event updated successfully"));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  if (!eventId) {
    throw new ApiError(403, "please provide eventId");
  }
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "event not found");
  }
  if (event.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "only owner can make changes");
  }
  await Event.findByIdAndDelete(eventId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "event deleted successfully"));
});

export { createEvent, getUserEvents, updateEvent, deleteEvent };
