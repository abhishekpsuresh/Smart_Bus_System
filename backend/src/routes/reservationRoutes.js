const express = require("express");

const {
  createReservation
} = require(
  "../controllers/reservationController"
);

const verifyToken = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// CREATE RESERVATION

router.post(
  "/create",
  verifyToken,
  createReservation
);

module.exports = router;