const express =
require("express");

const router =
express.Router();

const {

  sendOperatorRequest,

  getAllOperatorRequests,

  approveOperatorRequest,

  rejectOperatorRequest

} = require(
  "../controllers/operatorRequestController"
);


// SEND REQUEST

router.post(
  "/",
  sendOperatorRequest
);


// GET ALL REQUESTS

router.get(
  "/",
  getAllOperatorRequests
);


// APPROVE REQUEST

router.put(
  "/approve/:id",
  approveOperatorRequest
);


// REJECT REQUEST

router.put(
  "/reject/:id",
  rejectOperatorRequest
);


module.exports =
router;