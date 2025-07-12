import mongoose from "mongoose";

const opdVisitSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
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
  // diagnosis: String,
  // vitals: {
  //   bp: String,
  //   pulse: Number,
  //   temperature: Number,
  //   weight: Number,
  //   height: Number,
  // },
  // nextAppointment: Date,
  status: {
    type: String,
    enum: ["Scheduled", "Completed"],
    default: "Scheduled",
  },
  payment: {
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
  },
});

const Opd = mongoose.model("Opd", opdVisitSchema);
export default Opd;
