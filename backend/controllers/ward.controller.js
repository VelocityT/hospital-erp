import Bed from "../models/bed.js";
import Ward from "../models/ward.js";
import WardTypeConfig from "../models/wardType.js";

export const createOrUpdateWardTypes = async (req, res) => {
  try {
    const { wardTypesArr } = req.body;
    const adminId = req.authority._id;

    if (!Array.isArray(wardTypesArr) || wardTypesArr.length === 0) {
      return res
        .status(400)
        .json({ message: "wardTypesArr must be a non-empty array." });
    }

    // Trim and normalize new types
    const newTypes = wardTypesArr.map((t) => t.trim()).filter(Boolean);

    // Fetch existing config
    let config = await WardTypeConfig.findOne({ admin: adminId });

    if (config) {
      // Merge without duplicates
      const existingTypes = config.types.map((t) => t.trim());
      const mergedTypes = Array.from(new Set([...existingTypes, ...newTypes]));

      config.types = mergedTypes;
      await config.save();

      return res.status(200).json({
        message: "Ward types updated successfully.",
        data: config.types,
      });
    }

    // Create new config
    config = await WardTypeConfig.create({
      types: newTypes,
      admin: adminId,
    });

    res.status(201).json({
      message: "Ward types created successfully.",
      data: config.types,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getAllWardTypes = async (req, res) => {
  try {
    // console.log(req.authority)
    const adminId = req.authority._id;

    // const config = await WardTypeConfig.findOne({ admin: adminId });
    const config = await WardTypeConfig.findOne();

    if (!config) {
      return res.status(404).json({
        message: "No ward type config found for this admin.",
        data: null,
      });
    }

    res.status(200).json({
      message: "Ward types fetched successfully.",
      data: config.types,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createWard = async (req, res) => {
  try {
    const adminId = req.authority._id;
    const { wardId, type, ...rest } = req.body;

    if (!type || typeof type !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Ward type is required." });
    }

    const trimmedType = type.trim().toLowerCase();

    // Fetch allowed types for admin
    const config = await WardTypeConfig.findOne({ admin: adminId });
    if (!config || !Array.isArray(config.types)) {
      return res.status(400).json({
        success: false,
        message: "Ward types not configured for this admin.",
      });
    }

    const allowedTypes = config.types.map((t) => t.trim().toLowerCase());
    if (!allowedTypes.includes(trimmedType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ward type. Allowed types: ${allowedTypes.join(", ")}`,
      });
    }

    // 🛠 UPDATE if wardId provided
    if (wardId) {
      const updated = await Ward.findOneAndUpdate(
        { _id: wardId, admin: adminId },
        { ...rest, type: type.trim() },
        { new: true }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Ward not found or unauthorized." });
      }

      return res.status(200).json({
        success: true,
        ward: updated,
        message: "Ward updated successfully.",
      });
    }

    // ➕ CREATE new ward
    const ward = await Ward.create({
      ...rest,
      type: type.trim(),
      admin: adminId,
    });

    return res
      .status(201)
      .json({ success: true, ward, message: "Ward created successfully." });
  } catch (error) {
    console.error("Ward create/update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWard = async (req, res) => {
  try {
    const updated = await Ward.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Ward not found" });
    }
    res.json({ success: true, ward: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllWards = async (req, res) => {
  try {
    const adminId = req.authority._id;

    // const wards = await Ward.find({ admin: adminId }).sort({ createdAt: -1 });
    const wards = await Ward.find().sort({ createdAt: -1 });

    const enrichedWards = await Promise.all(
      wards.map(async (ward) => {
        const beds = await Bed.find({ ward: ward._id }).sort({ createdAt: 1 });
        return {
          ...ward.toObject(),
          beds,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: enrichedWards,
      count: enrichedWards.length,
    });
  } catch (error) {
    console.error("Error fetching wards with beds:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wards.",
      error: error.message,
    });
  }
};

export const createBeds = async (req, res) => {
  try {
    const { count, ward, charge } = req.body;
    console.log(req.body);

    if (!ward || !count || count < 1) {
      return res.status(400).json({
        success: false,
        message: "Ward ID and valid bed count are required.",
      });
    }

    // 1. Check if ward exists
    const wardData = await Ward.findById(ward);
    if (!wardData) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    // 2. Get existing beds in the ward
    const existingBedsCount = await Bed.countDocuments({ ward });

    // 3. Check if adding new beds exceeds capacity
    if (existingBedsCount + count > wardData.capacity) {
      return res.status(400).json({
        success: false,
        message: `Only ${
          wardData.capacity - existingBedsCount
        } beds can be created. Requested ${count}.`,
      });
    }

    // 4. Create new beds
    const newBeds = [];

    for (let i = 1; i <= count; i++) {
      const bedNumber = String(existingBedsCount + i); // auto incrementing number
      newBeds.push({
        bedNumber,
        ward,
        charge,
      });
    }

    const createdBeds = await Bed.insertMany(newBeds);

    // Now fetch and populate
    const populatedBeds = await Bed.find({
      _id: { $in: createdBeds.map((b) => b._id) },
    }).populate("ward", "name type floor");

    res.status(201).json({
      success: true,
      message: `${createdBeds.length} bed(s) created successfully.`,
      data: populatedBeds,
    });
  } catch (error) {
    console.error("Error in beds creation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create beds.",
      error: error.message,
    });
  }
};

export const getBedsByWardId = async (req, res) => {
  try {
    const { wardId } = req.params;

    if (!wardId) {
      return res.status(400).json({
        success: false,
        message: "Ward ID is required.",
      });
    }
    const ward = await Ward.findById(wardId);

    const beds = await Bed.find({ ward: wardId })
      .sort({ bedNumber: 1 })
      .populate({
        path: "ward",
        select: "name type floor",
      });

    res.status(200).json({
      success: true,
      data: { ward, beds },
      count: beds.length,
    });
  } catch (error) {
    console.error("Error fetching beds by ward:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch beds.",
      error: error.message,
    });
  }
};
export const deleteWard = async (req, res) => {
  try {
    const wardId = req.params.id;
    const adminId = req.authority._id;

    const ward = await Ward.findOne({ _id: wardId, admin: adminId });
    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found or not authorized.",
      });
    }

    // Delete all beds under the ward
    await Bed.deleteMany({ ward: wardId });

    // Delete the ward itself
    await Ward.findByIdAndDelete(wardId);

    return res.status(200).json({
      success: true,
      message: "Ward and associated beds deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting ward:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete ward.",
      error: error.message,
    });
  }
};
export const deleteLastBed = async (req, res) => {
  try {
    const { wardId } = req.params;

    if (!wardId) {
      return res
        .status(400)
        .json({ success: false, message: "Ward ID is required." });
    }

    const lastBed = await Bed.find({ ward: wardId })
      .sort({ bedNumber: -1 }) // Assuming bedNumber is numeric string
      .limit(1);

    if (!lastBed.length) {
      return res
        .status(404)
        .json({ success: false, message: "No beds found in this ward." });
    }

    const deleted = await Bed.findByIdAndDelete(lastBed[0]._id);

    res.status(200).json({
      success: true,
      message: `Bed ${deleted.bedNumber} deleted successfully.`,
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting last bed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete last bed.",
      error: error.message,
    });
  }
};
