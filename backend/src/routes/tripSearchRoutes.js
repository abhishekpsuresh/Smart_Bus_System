const express =
require("express");

const router =
express.Router();

// CONTROLLER

const {

  searchTrips

} = require(

  "../controllers/tripSearchController"

);

/*
=====================================================
SEARCH TRIPS
=====================================================
*/

router.get(

  "/",

  searchTrips

);

/*
=====================================================
EXPORT ROUTER
=====================================================
*/

module.exports =
router;