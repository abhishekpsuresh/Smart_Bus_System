const express =
require("express");

const router =
express.Router();

// AUTH MIDDLEWARE

const protect =
require("../middleware/authMiddleware");

// CONTROLLERS

const {

  createBooking,
  getTripSeats,
  cancelBooking,
  getMyBookings,
  getMyCancelledBookings,
  getTripBookings,
  getTripCancelledBookings,

  getOperatorTripBookings,
  getOperatorCancelledBookings

} = require(
  "../controllers/bookingController"
);



router.get(
  "/trip/:trip_id",
  protect,
  getTripBookings
);

router.get(
  "/cancelled/trip/:trip_id",
  protect,
  getTripCancelledBookings
);


router.get(
  "/operator/:trip_id",
  protect,
  getOperatorTripBookings
);

router.get(
  "/cancelled/operator/:trip_id",
  protect,
  getOperatorCancelledBookings
);


/*
=====================================================
MY BOOKINGS
=====================================================
*/

router.get(

  "/my-bookings",

  protect,

  getMyBookings

);

/*
=====================================================
MY CANCELLED BOOKINGS
=====================================================
*/

router.get(

  "/my-cancelled-bookings",

  protect,

  getMyCancelledBookings

);

/*
=====================================================
GET TRIP SEATS
=====================================================
*/

router.get(

  "/trip/:trip_id/seats",

  protect,

  getTripSeats

);


/*
=====================================================
EXPORT ROUTER
=====================================================
*/

router.put(
  "/cancel/:booking_id",
  protect,
  cancelBooking
);

module.exports =
router;