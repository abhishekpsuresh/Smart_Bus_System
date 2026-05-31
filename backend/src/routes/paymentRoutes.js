const express = require("express");

const {
  createPayment,
  verifyPayment
} = require("../controllers/paymentController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE PAYMENT

router.post(
  "/create",
  verifyToken,
  createPayment
);

// VERIFY PAYMENT

router.post(
  "/verify",
  verifyToken,
  verifyPayment
);

module.exports = router;