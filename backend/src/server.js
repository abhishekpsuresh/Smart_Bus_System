require("dotenv").config();

// DATABASE

require("./config/db");

// EXPRESS

const express =
require("express");

const cors =
require("cors");

// MIDDLEWARE

const verifyToken =
require("./middleware/authMiddleware");

// AUTO SERVICES

require("./utils/autoExpireReservations");

const autoRefunds =
require("./utils/autoRefunds");

// ROUTES

const authRoutes =
require("./routes/authRoutes");

const bookingRoutes =
require("./routes/bookingRoutes");

const paymentRoutes =
require("./routes/paymentRoutes");

const reservationRoutes =
require("./routes/reservationRoutes");

const operatorRequestRoutes =
require("./routes/operatorRequestRoutes");

const busRoutes =
require("./routes/busRoutes");

const tripRoutes =
require("./routes/tripRoutes");

const tripSearchRoutes =
require("./routes/tripSearchRoutes");

const seatRoutes =
require("./routes/seatRoutes");

const adminRoutes =
require("./routes/adminRoutes");

// APP

const app =
express();

const path =
require("path");

// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);

app.use(

  express.urlencoded({

    extended: true

  })

);

// AUTO REFUND CHECK

setInterval(

  async () => {

    try {

      await autoRefunds();

    }

    catch (error) {

      console.log(
        "Auto refund error:",
        error
      );

    }

  },

  60000

);

// API ROUTES

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/reservations",
  reservationRoutes
);

app.use(
  "/api/operator-requests",
  operatorRequestRoutes
);

app.use(
  "/api/buses",
  busRoutes
);

app.use(
  "/api/trips",
  tripRoutes
);

app.use(
  "/api/search-trips",
  tripSearchRoutes
);
app.use(
  "/api/seats",
  seatRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// HOME ROUTE

app.get(

  "/",

  (req, res) => {

    res.send(

      "✅ Smart Bus Booking Backend Running"

    );

  }

);

// PROTECTED TEST ROUTE

app.get(

  "/api/protected",

  verifyToken,

  (req, res) => {

    res.json({

      success: true,

      message:
      "Protected route accessed",

      user: req.user

    });

  }

);

// 404 HANDLER

app.use(

  (req, res) => {

    res.status(404).json({

      success: false,

      message:
      "Route not found"

    });

  }

);

// GLOBAL ERROR HANDLER

app.use(

  (err, req, res, next) => {

    console.log(err);

    res.status(500).json({

      success: false,

      message:
      "Internal Server Error"

    });

  }

);

// SERVER

const PORT =
process.env.PORT || 5000;

app.listen(

  PORT,

  () => {

    console.log(

      `🚀 Server running on port ${PORT}`

    );

  }

);