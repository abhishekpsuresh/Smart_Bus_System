const express =
require("express");

const router =
express.Router();

// CONTROLLERS

const {

  register,
  login

} = require(

  "../controllers/authController"

);

// REGISTER

router.post(

  "/register",

  register

);

// LOGIN

router.post(

  "/login",

  login

);

// EXPORT ROUTER

module.exports =
router;