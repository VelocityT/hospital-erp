import mongoose from "mongoose";

const opdVisitSchema = new mongoose.Schema({
  opdNumber: { type: String, unique: true, required: true },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  visitDateTime: { type: Date, default: Date.now },
  notes: String,
  symptoms: {
    symptomNames: [String],
    symptomTitles: [String],
    description: String,
  },
  diagnosis: String,
  vitals: {
    bp: String,
    pulse: Number,
    temperature: Number,
    weight: Number,
    height: Number,
  },
  nextAppointment: Date,
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed"],
    default: "Scheduled",
  },
});

const Opd = mongoose.model("Opd", opdVisitSchema);
export default Opd;
