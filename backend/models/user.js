import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  staffId: {
    type: String,
    unique: true,
    default: () => {
      const randomChar = String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );
      const timestampPart = Date.now().toString().slice(-6);
      return `${randomChar}${timestampPart}`;
    },
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "doctor", "nurse", "receptionist", "pharmacist"],
    default: "receptionist",
  },
  department: { type: String },
  designation: { type: String },

  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date },
  bloodGroup: { type: String },
  phone: { type: String },
  emergencyContact: { type: String },
  fatherName: { type: String },
  motherName: { type: String },
  maritalStatus: { type: String },

  currentAddress: { type: String },
  permanentAddress: { type: String },

  qualification: { type: String },
  specialist: { type: String },
  ipdCharge: { type: Number },
  opdCharge: { type: Number },
  dateOfJoining: { type: Date, default: Date.now },
  workExperience: { type: String },
  note: { type: String },

  panNumber: { type: String },
  aadharNumber: { type: String },
  reference: { type: String },

  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;

// permissions: [String],
// contact: {
//   phone: String,
//   emergencyContact: String
// },
// schedule: [{
//   day: String,
//   startTime: String,
//   endTime: String
// }],
