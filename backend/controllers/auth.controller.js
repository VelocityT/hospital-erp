import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import Opd from "../models/opd.js";
import Ipd from "../models/ipd.js";
import Patient from "../models/patient.js";
import Bill from "../models/bill.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // console.log(req.body);

    const getUser = await User.findOne({ email, role });
    if (!getUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, getUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const now = new Date();
    getUser.lastLogin = now;
    await getUser.save();

    const formattedLastLogin = dayjs(now);

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
      maxAge: 24 * 60 * 60 * 1000,
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

export const logoutUser = async (req, res) => {
  try {
    // console.log("logout trigger")
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const getDashboardStatsData = async (req, res) => {
  try {
    const { role } = req.authority;

    if (role === "admin") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Fetch IPD stats
      const ipdsToday = await Ipd.countDocuments({
        admissionDate: { $gte: todayStart, $lte: todayEnd },
      });
      const ipdsTotal = await Ipd.countDocuments();
      const ipdsActive = await Ipd.countDocuments({status:"Admitted"});


      // Fetch OPD stats
      const opdsToday = await Opd.countDocuments({
        visitDateTime: { $gte: todayStart, $lte: todayEnd },
      });
      const opdsTotal = await Opd.countDocuments();

      // Fetch total patients (if admitted today or visited today in OPD)
      const patientsToday = await Patient.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });
      const patientsTotal = await Patient.countDocuments();

      const doctors = await User.countDocuments({ role: "doctor" });
      const receptionists = await User.countDocuments({
        role: "receptionist",
      });
      const pharmacists = await User.countDocuments({ role: "pharmacist" });
      const nurses = await User.countDocuments({ role: "nurse" });
      const admins = await User.countDocuments({ role: "admins" });

      const todayIpdOpdIncome = await Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: todayStart, $lte: todayEnd },
            "entry.type": { $in: ["Ipd", "Opd"] },
          },
        },
        {
          $group: {
            _id: "$entry.type",
            total: { $sum: "$paidAmount" },
          },
        },
      ]);

      const todayIncomeMap = {
        Ipd: 0,
        Opd: 0,
      };

      todayIpdOpdIncome.forEach((item) => {
        todayIncomeMap[item._id] = item.total;
      });

      // Dummy today values
      todayIncomeMap.Pharmacy = 3000;
      todayIncomeMap.Pathology = 2000;
      const ipdOpdIncome = await Bill.aggregate([
        {
          $match: {
            "entry.type": { $in: ["Ipd", "Opd"] },
          },
        },
        {
          $group: {
            _id: "$entry.type",
            total: { $sum: "$paidAmount" },
          },
        },
      ]);

      const incomeMap = {
        Ipd: 0,
        Opd: 0,
      };

      ipdOpdIncome.forEach((item) => {
        incomeMap[item._id] = item.total;
      });

      // Add dummy values
      incomeMap.Pharmacy = 15500;
      incomeMap.Pathology = 12300;

      return res.status(200).json({
        success: true,
        message: "Admin dashboard stats fetched successfully.",
        data: {
          newPatients: {
            ipdsToday,
            opdsToday,
            patientsToday,
            patientsTotal,
            ipdsTotal,
            opdsTotal,
            ipdsActive
          },
          staffs: {
            doctors,
            receptionists,
            pharmacists,
            nurses,
            admins,
          },
          income: {
            today: todayIncomeMap,
            total: incomeMap,
          },
        },
      });
    }
    // If not admin
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this dashboard data.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

export const getIncomeOverview = async (req, res) => {
  try {
    const { incomeSource, filterMode = "date", selectedDate } = req.query;
    const { _id, role } = req.authority;

    if (!incomeSource) {
      return res.status(400).json({
        success: false,
        message: "Missing income source",
      });
    }

    const user = await User.findById(_id).select("role");
    if (!user || user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access: user not valid",
      });
    }

    // ======== ADMIN LOGIC ========
    if (user?.role === "admin") {
      const matchQuery = {
        "entry.type": incomeSource,
      };

      if (filterMode === "date") {
        const startOfDay = dayjs(selectedDate).startOf("day").toDate();
        const endOfDay = dayjs(selectedDate).endOf("day").toDate();

        matchQuery.createdAt = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      }

      const results = await Bill.aggregate([
        {
          $match: matchQuery,
        },
        {
          $group: {
            _id: "$patient",
            totalCharge: { $sum: "$totalCharge" },
            tax: { $sum: "$tax" },
            discount: { $sum: "$discount" },
            paidAmount: { $sum: "$paidAmount" },
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "_id",
            foreignField: "_id",
            as: "patient",
          },
        },
        { $unwind: "$patient" },
        {
          $project: {
            _id: 0,
            patientId: "$patient.patientId",
            fullName: "$patient.fullName",
            totalCharge: 1,
            tax: 1,
            discount: 1,
            paidAmount: 1,
          },
        },
        { $sort: { fullName: 1 } },
      ]);

      return res.status(200).json({
        success: true,
        data: results,
        message: `Income overview for ${incomeSource}`,
      });
    }

    // ======== NON-ADMIN LOGIC ========
    const allIncome = {
      Ipd: 12000,
      Opd: 8000,
      Pharmacy: 5000,
      Pathology: 4000,
    };

    if (incomeSource && allIncome[incomeSource]) {
      return res.status(200).json({
        success: true,
        data: {
          [incomeSource]: allIncome[incomeSource],
        },
        message: `Income data for ${incomeSource}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: allIncome,
      message: "Income overview fetched successfully",
    });
  } catch (error) {
    console.error("Income overview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch income overview",
      error: error.message,
    });
  }
};
