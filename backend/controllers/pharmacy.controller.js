import Medicine from "../models/medicine.js";

export const createAndUpdateMedicine = async (req, res) => {
  try {
    const { _id, ...details } = req.body;
    // console.log(details)

    // if (req.file) {
    //   details.imageUrl = `/uploads/${req.file.filename}`;
    // }

    details.buyPrice = parseFloat(details.buyPrice);
    details.sellPrice = parseFloat(details.sellPrice);

    const requiredFields = [
      "name",
      "category",
      "unit",
      "manufacturer",
      "buyPrice",
      "sellPrice",
    ];
    for (const field of requiredFields) {
      if (!details[field] && details[field] !== 0) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }

    let result;

    if (_id) {
      const existing = await Medicine.findById(_id);
      if (!existing) {
        return res.status(404).json({ message: "Medicine not found" });
      }

      Object.assign(existing, details);
      result = await existing.save();

      return res.status(200).json({
        message: "Medicine updated successfully",
        medicine: result,
      });
    } else {
      result = await Medicine.create(details);

      return res.status(201).json({
        message: "Medicine created successfully",
        medicine: result,
      });
    }
  } catch (error) {
    console.error("createAndUpdateMedicine error:", error);
    return res.status(500).json({ message: "Server error" });
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
      return res.status(404).json({ code: 404, message: "Medicine not found" });
    }

    await Medicine.findByIdAndDelete(id);

    return res.status(200).json({ code: 200, message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Delete Medicine Error:", error);
    return res.status(500).json({ code: 500, message: "Server error" });
  }
};
