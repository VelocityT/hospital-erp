import dayjs from "dayjs";
import Ipd from "../models/ipd.js";
import Opd from "../models/opd.js";
import Bill from "../models/bill.js";

export const payPatientIpdBill = async (req, res) => {
  try {
    const payload = req.body;
    // console.log(payload);
    // const payingAmount = payload?.payingAmount;
    const tax = payload?.tax || 0;
    const discount = payload?.discount || 0;
    const amountPaying = payload?.amountPaying;

    if (!amountPaying || amountPaying < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount. Must be at least ₹1.",
      });
    }
    // console.log(payload)

    let getEntry;
    getEntry = await Ipd.findOne({
      _id: payload?.entry?.entryId,
      ipdNumber: payload?.entry?.checkId,
    })
      .populate("attendingDoctor", "ipdCharge")
      .populate("bed", "charge")
      .populate("payment.bill");

    if (getEntry) {
      const admissionDate = dayjs(getEntry.admissionDate);
      const dischargeDate = dayjs(getEntry.dischargeSummary?.dischargeDate);
      const effectiveDischargeDate = dischargeDate || dayjs();
      const days = Math.max(
        effectiveDischargeDate.diff(admissionDate, "day"),
        1
      );
      // const days = Math.max(dischargeDate.diff(admissionDate, "day"), 1);

      const bedCharge = (getEntry.bed?.charge || 0) * days;
      const doctorCharge = (getEntry.attendingDoctor?.ipdCharge || 0) * days;
      const totalAmountFromDb = bedCharge + doctorCharge;

      const newTotalAmount = totalAmountFromDb + tax - discount;
      const paidAmount = amountPaying + tax - discount;

      const totalChargePaid = getEntry?.payment?.bill.reduce(
        (sum, bill) => sum + (bill?.totalCharge || 0),
        0
      );
      const doesFullPaymentDone = totalChargePaid + amountPaying;
      // console.log(doesFullPaymentDone);
      // console.log(totalAmountFromDb);

      const billData = {
        patient: getEntry?.patient,
        entry: {
          type: "Ipd",
          entryId: getEntry?._id,
          checkId: getEntry?.ipdNumber,
        },
        paidAmount: paidAmount,
        payableAmount:totalAmountFromDb-totalChargePaid-amountPaying,
        totalCharge: amountPaying,
        tax: tax,
        discount: discount,
        paymentMethod: payload?.paymentMethod,
      };

      const newBill = await Bill.create(billData);

      await Ipd.findByIdAndUpdate(getEntry._id, {
        $set: {
          "payment.status":
            doesFullPaymentDone === totalAmountFromDb && getEntry?.dischargeDate ? "Paid" : "Pending",
        },
        $push: {
          "payment.bill": newBill._id,
        },
      });

      const updatedIpd = await Ipd.findById(getEntry._id)
        .populate("attendingDoctor", "ipdCharge fullName")
        .populate("bed", "charge")
        .populate("payment.bill");

      return res.status(200).json({
        success: true,
        message: "Payment recorded successfully.",
        data: {
          updatedIpd,
        },
      });
    }

    res.status(404).json({
      success: false,
      message: "IPD entry not found or invalid type.",
    });
  } catch (error) {
    console.error("Error updating payment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment details",
      error: error.message,
    });
  }
};

export const payPatientOpdBill = async (req, res) => {
  try {
    const payload = req.body;

    const tax = payload?.tax || 0;
    const discount = payload?.discount || 0;
    const amountPaying = payload?.amountPaying;

    if (!amountPaying || amountPaying < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount. Must be at least ₹1.",
      });
    }

    let getEntry;
    getEntry = await Opd.findOne({
      _id: payload?.entry?.entryId,
      opdNumber: payload?.entry?.checkId,
    }).populate("doctor", "opdCharge");
    if (getEntry) {
      const newTotalAmount = getEntry?.doctor?.opdCharge + tax - discount;
      // console.log(newTotalAmount)
      const billData = {
        patient: getEntry?.patient,
        entry: {
          type: "Opd",
          entryId: getEntry?._id,
          checkId: getEntry?.opdNumber,
        },
        totalCharge: amountPaying,
        tax,
        discount,
        paidAmount: newTotalAmount,
        payableAmount:0,
        paymentMethod: payload?.paymentMethod,
      };

      const newBill = await Bill.create(billData);

      await Opd.findByIdAndUpdate(getEntry._id, {
        $set: {
          "payment.status":  "Paid",
        },
        $push: {
          "payment.bill": newBill._id,
        },
      });

      const updatedOpd = await Opd.findById(getEntry._id)
        .populate("doctor", "fullName role opdCharge")
        .populate("payment.bill");
      return res.status(200).json({
        success: true,
        message: "Payment recorded successfully.",
        data: {
          updatedOpd,
        },
      });
    }

    res.status(404).json({
      success: false,
      message: "IPD entry not found or invalid type.",
    });
  } catch (error) {
    console.error("Error updating payment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment details",
      error: error.message,
    });
  }
};
