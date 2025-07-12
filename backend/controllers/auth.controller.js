import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import Opd from "../models/opd.js";
import Ipd from "../models/ipd.js";
import Patient from "../models/patient.js";
import Bill from "../models/bill.js";
import Hospital from "../models/hospital.js";
import { hashPassword } from "../utils/helper.js";
import { generateCustomId } from "../utils/generateCustomId.js";

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

    const hospitalStatus = await Hospital.findById(getUser?.hospital);
    if (getUser?.role !== "superAdmin" && hospitalStatus?.isDisabled) {
      return res.status(401).json({
        success: false,
        message: "Access to this hospital is not allowed",
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
      hospital: getUser?.hospital || null,
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
        hospital: hospitalStatus,
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
    const { role, hospital } = req.authority;
    // console.log(hospital);

    if (role === "admin") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Fetch IPD stats
      const ipdsToday = await Ipd.countDocuments({
        hospital,
        admissionDate: { $gte: todayStart, $lte: todayEnd },
      });
      const ipdsTotal = await Ipd.countDocuments({ hospital });
      const ipdsActive = await Ipd.countDocuments({
        status: "Admitted",
        hospital,
      });

      // Fetch OPD stats
      const opdsToday = await Opd.countDocuments({
        hospital,
        visitDateTime: { $gte: todayStart, $lte: todayEnd },
      });
      const opdsTotal = await Opd.countDocuments({ hospital });

      // Fetch total patients (if admitted today or visited today in OPD)
      const patientsToday = await Patient.countDocuments({
        hospital,
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });
      const patientsTotal = await Patient.countDocuments({ hospital });

      const doctors = await User.countDocuments({ role: "doctor", hospital });
      const receptionists = await User.countDocuments({
        hospital,
        role: "receptionist",
      });
      const pharmacists = await User.countDocuments({
        role: "pharmacist",
        hospital,
      });
      const nurses = await User.countDocuments({ role: "nurse", hospital });
      const admins = await User.countDocuments({ role: "admins", hospital });

      const todayIpdOpdIncome = await Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: todayStart, $lte: todayEnd },
            "entry.type": { $in: ["Ipd", "Opd"] },
            hospital,
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
            hospital,
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
      console.log(incomeMap);

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
            ipdsActive,
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

    if (role === "superAdmin") {
      const hospitals = await Hospital.find({
        createdBy: req.authority._id,
      })
        .select("fullName email phone isDisabled")
        .lean();

      const hospitalStats = await Promise.all(
        hospitals.map(async (hospital) => {
          const hospitalId = hospital._id;

          const [staffCount, patientCount] = await Promise.all([
            User.countDocuments({ hospital: hospitalId }),
            Patient.countDocuments({ hospital: hospitalId }),
          ]);

          return {
            _id: hospitalId,
            name: hospital.fullName,
            staffCount,
            patientCount,
          };
        })
      );

      const stats = {
        total: hospitals.length,
        active: hospitals.filter((h) => !h.isDisabled).length,
        inactive: hospitals.filter((h) => h.isDisabled).length,
      };

      return res.status(200).json({
        success: true,
        message: "SuperAdmin dashboard data fetched.",
        data: {
          hospitals,
          hospitalStats,
          stats,
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
    const { hospital, _id, role } = req.authority;
    const { incomeSource, filterMode = "date", selectedDate } = req.query;

    if (!incomeSource) {
      return res.status(400).json({
        success: false,
        message: "Missing income source",
      });
    }
    const user = await User.findOne({ _id, hospital }).select("role");
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
          $match: { ...matchQuery, hospital },
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

export const createOrUpdateHospital = async (req, res) => {
  try {
    const {
      adminFullName,
      adminEmail,
      adminPassword,
      adminPhone,
      fullName,
      address,
      phone,
      email,
      website,
      hospitalId,
      isDisabled,
      staffPrefix,
      patientPrefix,
      ...modules
    } = JSON.parse(req.body.hospitalInfo);

    const editMode = req.body.editMode === "true";
    const logo = req.file;
    const createdBy = req.authority?._id;

    if (editMode && hospitalId) {
      const existingHospital = await Hospital.findById(hospitalId);
      if (!existingHospital) {
        return res.status(404).json({
          success: false,
          message: "Hospital not found",
        });
      }

      const updateData = {
        fullName,
        address,
        phone,
        email,
        website,
        modules,
        isDisabled,
        staffPrefix,
        patientPrefix,
      };

      if (logo) {
        updateData.logoUrl = logo.path;
      }

      await Hospital.findByIdAndUpdate(hospitalId, updateData, { new: true });

      return res.status(200).json({
        success: true,
        message: "Hospital updated successfully",
      });
    }

    const hashedPassword = await hashPassword(adminPassword);

    const AdminData = {
      fullName: adminFullName,
      password: hashedPassword,
      email: adminEmail,
      phone: adminPhone,
    };

    const HospitalData = {
      fullName,
      address,
      phone,
      email,
      website,
      modules,
      createdBy,
      isDisabled,
      staffPrefix,
      patientPrefix,
    };

    if (logo) {
      HospitalData.logoUrl = logo.path;
    }
    const existingHospital = await Hospital.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital with this email or phone already exists",
      });
    }
    const newHospital = await Hospital.create(HospitalData);

    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { phone: adminPhone }],
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email or phone already exists",
      });
    }
    const staffId = await generateCustomId(newHospital?._id, "staff");
    const newUser = await User.create({
      staffId,
      ...AdminData,
      role: "admin",
      hospital: newHospital._id,
    });

    newHospital.admins.push(newUser._id);
    await newHospital.save();

    return res.status(201).json({
      success: true,
      message: "Hospital and admin created successfully",
      hospitalId: newHospital._id,
      adminId: newUser._id,
    });
  } catch (error) {
    console.error("createOrUpdateHospital error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getHospitalList = async (req, res) => {
  try {
    const superAdminId = req.authority?._id;

    const superAdmin = await User.findOne({
      _id: superAdminId,
      role: "superAdmin",
    });
    if (!superAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only super admins can view hospitals.",
      });
    }

    const hospitalsList = await Hospital.find({ createdBy: superAdminId });

    return res.status(200).json({
      success: true,
      hospitals: hospitalsList,
    });
  } catch (error) {
    console.error("Unable to fetch hospitals list", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getHospitalById = async (req, res) => {
  try {
    const hospitalId = req.params.id;

    const hospital = await Hospital.findById(hospitalId).populate(
      "admins",
      "fullName email phone staffId"
    );

    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, message: "Hospital not found" });
    }

    return res.status(200).json({ success: true, hospital });
  } catch (err) {
    console.error("Get Hospital By ID Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const impersonateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const targetUser = await User.findById(userId).select("-password");
    const hospitalStatus = await Hospital.findById(targetUser?.hospital);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found for impersonation.",
      });
    }
    const impersonatedBy = req.authority?._id;
    const token = jwt.sign(
      {
        _id: targetUser._id,
        role: targetUser.role,
        email: targetUser.email,
        hospital: targetUser?.hospital || null,
        impersonatedBy,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400000,
    });

    return res.status(200).json({
      success: true,
      message: `Now impersonating ${targetUser.fullName}`,
      user: { targetUser, impersonatedBy },
      hospital:hospitalStatus
    });
  } catch (err) {
    console.error("Impersonation error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const leaveImpersonation = async (req, res) => {
  try {
    const originalUserId = req.authority?.impersonatedBy;
    console.log(originalUserId);

    if (!originalUserId) {
      return res.status(400).json({
        success: false,
        message: "Not impersonating any user.",
      });
    }

    const originalUser = await User.findById(originalUserId).select(
      "-password"
    );
    if (!originalUser) {
      return res.status(404).json({
        success: false,
        message: "Original user not found.",
      });
    }

    const token = jwt.sign(
      { _id: originalUser._id, role: originalUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400000,
    });

    res.status(200).json({
      success: true,
      message: "Returned to original user.",
      user: originalUser,
    });
  } catch (err) {
    console.error("Leave Impersonation Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
