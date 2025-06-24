import User from "../models/user.js";

export const registerUser = async(req, res) => {
  try {


    const userData = {
      fullName: req.body.fullName,
      gender: req.body.gender,
      dob: new Date(req.body.dob),
      bloodGroup: req.body.bloodGroup,

      // Professional
      department: req.body.department,
      designation: req.body.designation,
      qualification: req.body.qualification,
      specialist: req.body.specialist,
      appointmentCharge: Number(req.body.appointmentCharge), // convert to Number

      // Address
      line1: req.body.line1,
      line2: req.body.line2 || "",
      city: req.body.city,
      pincode: req.body.pincode,

      // Contact
      email: req.body.email,
      phone: req.body.phone,

      // Auth
      password: req.body.password,
      role: req.body.role || "receptionist",
    };

    const newUser  = await User.create(userData)

    res.status(200).json({
      success: true,
      message: "User data received",
      data: newUser,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getUsers = async (req, res) => {
  try {
    console.log(req.query);
    const userType = req.query.userType;
    const response = await User.find({ role: userType }).select("-password");
    // console.log(response)

    return res.status(201).json({
      success: true,
      message: "Users fetched successfully",
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
