const express =
require("express");

const router =
express.Router();

// CONTROLLERS

const {

  getSeatsByTrip,
  updateSeatStatus

} = require(

  "../controllers/seatController"

);

/*
---------------------------------------------------
TEST ROUTE
---------------------------------------------------
*/

router.get(

  "/test",

  (req, res) => {

    res.json({

      success: true,

      message:
      "Seat routes working"

    });

  }

);

/*
---------------------------------------------------
GET SEATS BY TRIP
---------------------------------------------------
*/

router.get(

  "/:tripId",

  getSeatsByTrip

);

/*
---------------------------------------------------
UPDATE SEAT STATUS
---------------------------------------------------
*/

router.put(

  "/:seat_id",

  updateSeatStatus

);

module.exports =
router;