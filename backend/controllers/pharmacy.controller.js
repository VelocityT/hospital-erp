import Medicine from "../models/medicine.js";
import { parseExcel } from "../utils/parseExcel.js";

const fieldMap = {
  "Name": "name",
  "Category": "category",
  "Unit": "unit",
  "Manufacturer": "manufacturer",
  "Received Date": "recDate",
  "Batch No.": "batch",
  "Manufacture Date": "manufactureDate",
  "Expiry Date": "expiryDate",
  "Supplier": "supplier",
  "Invoice No.": "invoiceNo",
  "Invoice Date": "invoiceDate",
  "Cost Price": "costPrice",
  "Purchase Price": "purchasePrice",
  "Sell Price": "sellPrice",
  "MRP": "mrp",
  "Stock": "currentStock",
};

export const createAndUpdateMedicine = async (req, res) => {
  try {
    const { _id, ...details } = req.body;
    // console.log(details)

    // if (req.file) {
    //   details.imageUrl = `/uploads/${req.file.filename}`;
    // }

    details.costPrice = parseFloat(details.costPrice);
    details.purchasePrice = parseFloat(details.purchasePrice);
    details.sellPrice = parseFloat(details.sellPrice);

    const requiredFields = [
      "name",
      "category",
      "unit",
      "manufacturer",
      "costPrice",
      "purchasePrice",
      "sellPrice",
      "mrp",
      "recDate",
      "expiryDate",
    ];

    for (const field of requiredFields) {
      if (!details[field] && details[field] !== 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    let result;

    if (_id) {
      const existing = await Medicine.findById(_id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Medicine not found" });
      }

      Object.assign(existing, details);
      result = await existing.save();

      return res.status(200).json({
        success: true,
        message: "Medicine updated successfully",
        medicine: result,
      });
    } else {
      result = await Medicine.create(details);

      return res.status(201).json({
        success: true,
        message: "Medicine created successfully",
        medicine: result,
      });
    }
  } catch (error) {
    console.error("createAndUpdateMedicine error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Medicines retrieved successfully",
      data: medicines,
    });
  } catch (error) {
    console.error("Get Medicines Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve medicines",
    });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Medicine not found",
      });
    }

    medicine.isDeleted = !medicine.isDeleted;
    await medicine.save();

    return res.status(200).json({
      success: true,
      code: 200,
      message: `Medicine ${
        medicine.isDeleted ? "marked as deleted" : "restored successfully"
      }`,
    });
  } catch (error) {
    console.error("Delete Medicine Error:", error);
    return res.status(500).json({
      success: false,
      code: 500,
      message: "Server error",
    });
  }
};

export const uploadMedicineExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // console.log("Received file:", req.file.originalname);
    const rows = parseExcel(req.file.buffer, fieldMap);

    if (
      !rows ||
      rows.length === 0 ||
      rows.every((row) => Object.keys(row).length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty or improperly formatted",
      });
    }

    const savedMedicines = await Medicine.insertMany(rows);

    return res.status(200).json({
      success: true,
      message: `${savedMedicines.length} medicines saved successfully`,
      data:{savedMedicines}
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading or saving data",
    });
  }
};
