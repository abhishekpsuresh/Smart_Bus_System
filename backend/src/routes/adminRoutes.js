const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");

const {
  getAllUsers,
  deleteUser,
  getAllBusesAdmin
} = require("../controllers/adminController");

router.get(
  "/users",
  verifyToken,
  getAllUsers
);

router.get(
  "/buses",
  verifyToken,
  getAllBusesAdmin
);


router.delete(
  "/users/:id",
  verifyToken,
  deleteUser
);

module.exports = router;