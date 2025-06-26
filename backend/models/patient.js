import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  registrationDate: { type: Date, default: Date.now },
  patientId: {
    type: String,
    unique: true,
    default: () => `HOSP-${Date.now().toString().slice(-6)}`,
  },
  fullName: { type: String, required: true },
  age: {
    years: { type: Number, required: true, min: 0 },
    months: { type: Number, required: true, min: 0, max: 11 },
    days: { type: Number, required: true, min: 0, max: 30 },
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  dob: Date,
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
  },
  // patientType: {
  //   type: String,
  //   enum: ["OPD", "IPD"],
  //   default: "OPD",
  // },
  symptoms: {
    symptomNames: [String],
    symptomTitles: [String],
    description: String,
  },
  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  contact: {
    phone: { type: String, required: true },
    email: String,
  },
  medicalDocuments: [
    {
      name: String,
      url: String,
      type: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
