import Hospital from "../models/hospital.js";
import Ipd from "../models/ipd.js";
import Opd from "../models/opd.js";
import User from "../models/user.js";
import { generateCustomId } from "../utils/generateCustomId.js";
import { hashPassword } from "../utils/helper.js";

export const registerOrUpdateUser = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const photo = req.file;
    const userData = req.body;

    if (userData.edit === "true" && userData?._id) {
      const { _id, edit, password, ...rest } = userData;

      const updatedUser = await User.findOneAndUpdate(
        { _id, hospital },
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
    const staffId = await generateCustomId(hospital, "staff");
    const newUser = await User.create({
      staffId,
      ...userData,
      hospital,
      password: await hashPassword(userData.password),
      ...(photo && { profilePhoto: `/uploads/${photo.filename}` }),
    });
    if (newUser.role === "admin") {
      await Hospital.findByIdAndUpdate(hospital, {
        $push: { admins: newUser._id },
      });
    }

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
    const { hospital } = req.authority;
    const userType = req.query.userType;
    const users = await User.find({ hospital, role: userType })
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
    const { hospital } = req.authority;
    const response = await User.find({ hospital }).select(
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
    const { hospital, role } = req.authority;
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    let user;
    if (role === "superAdmin") {
      user = await User.findOne({ _id: id }).select("-password");
    } else {
      user = await User.findOne({ _id: id, hospital }).select("-password");
    }

    const filter = { attendingDoctor: user._id };
    const opdFilter = { doctor: user._id };

    if (user.role !== "superAdmin") {
      filter.hospital = hospital;
      opdFilter.hospital = hospital;
    }

    const doctorIpds = await Ipd.find(filter)
      .select("ipdNumber status patient bed ward")
      .populate({ path: "patient", select: "fullName" })
      .populate({ path: "bed", select: "bedNumber -_id" })
      .populate({ path: "ward", select: "name floor -_id" })
      .lean();

    const doctorOpds = await Opd.find(opdFilter)
      .select("opdNumber visitDateTime")
      .populate({ path: "patient", select: "fullName -_id" })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: { user, doctorIpds, doctorOpds },
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};
