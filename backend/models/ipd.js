import mongoose from "mongoose";

const ipdAdmissionSchema = new mongoose.Schema({
  ipdNumber: { type: String, unique: true, required: true },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  admissionDate: { type: Date, default: Date.now },
  notes: String,
  dischargeDate: Date,
  reason: String,
  bed: String,
  ward: String,
  height: String,
  weight: String,
  bloodPressure: String,

  // bed: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Bed'
  // },
  attendingDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  diagnosis: String,
  treatmentPlan: String,
  status: {
    type: String,
    enum: ["Admitted", "Discharged"],
    default: "Admitted",
  },
  consentForms: [
    {
      formType: String,
      signedBy: String,
      signedAt: Date,
    },
  ],
});

const Ipd = mongoose.model("Ipd", ipdAdmissionSchema);
export default Ipd;
