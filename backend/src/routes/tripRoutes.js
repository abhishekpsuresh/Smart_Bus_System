const express =
require("express");

const router =
express.Router();

// AUTH MIDDLEWARE

const protect =
require("../middleware/authMiddleware");

// CONTROLLERS

const {
  addTrip,
  getOperatorTrips,
  getSingleTrip,
  updateTrip,
  deleteTrip,
  getAllTrips


} = require(

  "../controllers/tripController"

);

// ADD TRIP

router.post(

  "/",

  protect,

  addTrip

);

// GET SINGLE TRIP

router.get(

  "/single/:id",

  getSingleTrip

);

/*
=====================================================
GET ALL TRIPS (ADMIN)
=====================================================
*/

router.get(

  "/admin/all",

  protect,

  getAllTrips

);



// GET OPERATOR TRIPS

router.get(

  "/:operator_id",

  protect,

  getOperatorTrips

);

// UPDATE TRIP

router.put(

  "/:id",

  protect,

  updateTrip

);

// DELETE TRIP

router.delete(

  "/:id",

  protect,

  deleteTrip

);

// EXPORT

module.exports =
router;