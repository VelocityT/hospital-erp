import User from "../models/user.js";
import { hashPassword } from "../utils/helper.js";

export const registerUser = async (req, res) => {
  try {
    // console.log(req.file)
    const photo = req.file;
    const userData = req.body;

    // console.log(userData.password)
    // const password = await hashPassword(req.body.password);
    // console.log(password);

    // return res.status(200).json({
    //   success: true,
    //   message: "User data received",
    //   // data: newUser,
    // });

    const newUser = await User.create({
      ...userData,
      password: await hashPassword(req.body.password),
    });

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
export const getAllStaff = async (req, res) => {
  try {
    const response = await User.find().select("fullName role staffId gender department");
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
