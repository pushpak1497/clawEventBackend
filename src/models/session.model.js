import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
