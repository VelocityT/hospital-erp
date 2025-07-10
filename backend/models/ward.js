import mongoose from "mongoose";

const wardSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    // department: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Department",
    // },
    floor: {
      type: String,
      enum: [
        "Ground",
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
        "8th",
        "9th",
        "10th",
      ],
      trim: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Ward = mongoose.model("Ward", wardSchema);
export default Ward;
