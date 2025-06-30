import User from "../models/user.js";

export const getDoctorsForPatientResgistration = async (req, res) => {
  try {
    const response = await User.find({ role: "doctor" }).select("fullName");

    return res.status(201).json({
      success: true,
      message: "Doctor fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
