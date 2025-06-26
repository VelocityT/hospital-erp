import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },
    type: {
      type: String,
      enum: ["Regular", "ICU", "Ventilator", "Special"],
      default: "Regular",
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      default: null,
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bedSchema.index({ bedNumber: 1, ward: 1 }, { unique: true });

export default mongoose.model("Bed", bedSchema);
