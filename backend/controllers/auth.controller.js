import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

export const loginUser = async (req, res) => {
  try {
    console.log(req.body);

    const getUser = await User.findOne({
      role: req.body.role,
      email: req.body.username,
      password: req.body.password,
    });

    if (!getUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update lastLogin
    const now = new Date();
    getUser.lastLogin = now;
    await getUser.save();

    const formattedLastLogin = dayjs(now).format("DD-MM-YY HH:mm");

    // Create token
    const payload = {
      email: getUser.email,
      role: getUser.role,
      _id: getUser._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const userData = getUser.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        ...userData,
        lastLogin: formattedLastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
