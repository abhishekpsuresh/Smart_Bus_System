const express =
require("express");

const router =
express.Router();

const verifyToken =
require("../middleware/authMiddleware");

const upload =
require("../middleware/uploadBusImages");


const {

  addBus,

  getAllBuses,

  updateBus,

  deleteBus,

  uploadBusImages,

  getBusImages

} = require("../controllers/busController");

router.post(
  "/:id/images",
  verifyToken,
  upload.array(
    "images",
    10
  ),
  uploadBusImages
);

/*
========================================
ADD BUS
========================================
*/

router.post(

  "/",

  verifyToken,

  addBus

);

/*
========================================
GET BUSES
========================================
*/

router.get(

  "/",

  verifyToken,

  getAllBuses

);

/*
========================================
UPDATE BUS
========================================
*/

router.put(

  "/:id",

  verifyToken,

  updateBus

);

/*
========================================
DELETE BUS
========================================
*/

router.delete(

  "/:id",

  verifyToken,

  deleteBus

);

router.get(
  "/:id/images",
  getBusImages
);

module.exports =
router;