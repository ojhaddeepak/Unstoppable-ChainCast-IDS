const express = require("express");
const router = express.Router();
const { createOrder, verifyPaymentSignature } = require("../services/razorpayService");
// const { recordOnBlockchain } = require("../services/gasBookingBlockchain"); // To be implemented

router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR
        const order = await createOrder(amount);
        res.json(order);
    } catch (error) {
        console.error("Order Create Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

router.post("/verify-payment", async (req, res) => {
    try {
        const { order_id, payment_id, signature, bookingDetails } = req.body;

        const isValid = verifyPaymentSignature(order_id, payment_id, signature);

        if (isValid) {
            // TODO: Call Blockchain Service Here
            // const txHash = await recordOnBlockchain(bookingDetails, payment_id);
            const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

            res.json({
                success: true,
                message: "Payment Verified & Gas Booked",
                txHash: mockTxHash
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.error("Payment Verify Error:", error);
        res.status(500).json({ error: "Verification failed" });
    }
});

module.exports = router;
