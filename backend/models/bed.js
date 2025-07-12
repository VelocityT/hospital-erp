import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
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
    // type: {
    //   type: String,
    //   enum: ["Regular", "ICU", "Ventilator", "Special"],
    //   default: "Regular",
    // },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    // admissionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Admission",
    //   default: null,
    // },
    notes: {
      type: String,
      trim: true,
    },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
    charge: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

bedSchema.index({ bedNumber: 1, ward: 1 }, { unique: true });

const Bed = mongoose.model("Bed", bedSchema);
export default Bed;
