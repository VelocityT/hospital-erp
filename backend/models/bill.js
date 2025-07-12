import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    billNumber: {
      type: String,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    entry: {
      entryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "enteries.type",
      },
      checkId: String,
      type: {
        type: String,
        enum: ["Ipd", "Opd", "Pathology", "Pharmacy"],
        required: true,
      },
    },
    // totalAmount: {
    //   type: Number,
    //   default: 0,
    // },
    totalCharge: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    payableAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Insurance"],
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Auto-generate bill number without counter model
billSchema.pre("save", async function (next) {
  if (this.isNew && !this.billNumber) {
    const lastBill = await mongoose
      .model("Bill")
      .findOne({})
      .sort({ createdAt: -1 })
      .select("billNumber")
      .lean();

    let lastNumber = 0;

    if (lastBill && lastBill.billNumber) {
      const match = lastBill.billNumber.match(/BILL-(\d+)/);
      if (match) {
        lastNumber = parseInt(match[1], 10);
      }
    }

    const newNumber = lastNumber + 1;
    this.billNumber = `BILL-${String(newNumber).padStart(6, "0")}`;
  }
  next();
});

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
