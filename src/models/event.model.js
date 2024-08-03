import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, default: "this is a event" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
