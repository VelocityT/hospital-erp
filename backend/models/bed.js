import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true },
  ward: { type: String, required: true },
  type: {
    type: String,
    enum: ['General', 'ICU', 'Emergency', 'Maternity', 'Pediatric'],
    default: 'General'
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  },
  currentPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  lastCleaned: Date,
  features: [String] // e.g., ["Oxygen", "Monitor"]
});

const Bed = mongoose.model("Bed",bedSchema)
export default Bed
