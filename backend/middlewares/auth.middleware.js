import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const user = await User.findById(decoded._id).populate("hospital");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }
    if (user?.role !== "superAdmin" && user?.hospital?.isDisabled) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Access to this hospital is not allowed",
        });
    }
    // console.log(decoded);
    // console.log(decoded)
    req.authority = {
      role: user.role,
      _id: user._id,
      email: user.email,
      hospital: user.hospital?._id || null,
      impersonatedBy: decoded.impersonatedBy,
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
