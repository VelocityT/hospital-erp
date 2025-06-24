import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic Auth Info
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Role and Department
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist'],
    default: 'receptionist'
  },
  department: { type: String },

  // Personal Details
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  bloodGroup: { type: String },
  phone: { type: String },

  // Address
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  pincode: { type: String },

  // Professional Details
  designation: { type: String },
  qualification: { type: String },
  specialist: { type: String },
  appointmentCharge: { type: Number },


  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});


const User = mongoose.model("User",userSchema)
export default User



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
