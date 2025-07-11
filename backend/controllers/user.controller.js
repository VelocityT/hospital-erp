import dayjs from "dayjs";
import User from "../models/user.js";
import { hashPassword } from "../utils/helper.js";

export const registerOrUpdateUser = async (req, res) => {
  try {
    const photo = req.file;
    const userData = req.body;

    if (userData.edit === "true" && userData?._id) {
      const { _id, edit, password, ...rest } = userData;

      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { ...rest },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found for update",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    }

    // If it's not an update, it's a new registration
    const newUser = await User.create({
      ...userData,
      password: await hashPassword(userData.password),
      ...(photo && { profilePhoto: `/uploads/${photo.filename}` }),
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const fieldLabels = {
        email: "Email",
        phone: "Phone Number",
        panNumber: "PAN Number",
        aadharNumber: "Aadhar Number",
      };

      return res.status(400).json({
        success: false,
        message: `${
          fieldLabels[duplicateField] || duplicateField
        } already exists`,
      });
    }

    console.error("Error in registerOrUpdateUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const userType = req.query.userType;
    const users = await User.find({ role: userType })
      .select("-password")
      .lean();
    // const enrichedUsers = users.map((user) => user);

    // console.log(response)

    return res.status(201).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
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
    const response = await User.find().select(
      "fullName role staffId gender department"
    );
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
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};
