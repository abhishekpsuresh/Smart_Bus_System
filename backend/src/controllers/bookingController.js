const db =
require("../config/db");

const expireReservations =
require("../utils/expireReservations");

/*
=====================================================
CREATE BOOKING
=====================================================
*/

const createBooking =
async (req, res) => {

  try {

    // AUTO EXPIRE

    await expireReservations();

    const {

      booking_code,
      user_id,
      trip_id,
      seat_id,
      passenger_name,
      passenger_gender,
      passenger_age,
      total_passengers,
      copassenger_preference,
      fare

    } = req.body;

    /*
    -------------------------------------------------
    GET TRIP
    -------------------------------------------------
    */

    const [tripData] =
    await db.query(

      `
      SELECT *
      FROM trips
      WHERE id = ?
      `,

      [trip_id]

    );

    if (
      tripData.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
        "Trip not found"

      });

    }

    const trip =
    tripData[0];

    /*
    -------------------------------------------------
    GET SEAT
    -------------------------------------------------
    */

    const [seatData] =
    await db.query(

      `
      SELECT *
      FROM seats
      WHERE id = ?
      `,

      [seat_id]

    );

    if (
      seatData.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
        "Seat not found"

      });

    }

    const seat =
    seatData[0];

    /*
    -------------------------------------------------
    CHECK BOOKED
    -------------------------------------------------
    */

    const [existingBooking] =
    await db.query(

      `
      SELECT *
      FROM bookings
      WHERE trip_id = ?
      AND seat_number = ?
      AND booking_status = 'Booked'
      `,

      [

        trip_id,
        seat.seat_number

      ]

    );

    if (
      existingBooking.length > 0
    ) {

      return res.status(400).json({

        success: false,

        message:
        "Seat already booked"

      });

    }

    /*
    -------------------------------------------------
    CHECK ACTIVE RESERVATION
    -------------------------------------------------
    */

    const [activeReservation] =
    await db.query(

      `
      SELECT *
      FROM reservation_requests
      WHERE trip_id = ?
      AND seat_number = ?
      AND reservation_status = 'Pending'
      `,

      [

        trip_id,
        seat.seat_number

      ]

    );

    if (
      activeReservation.length > 0
    ) {

      return res.status(400).json({

        success: false,

        message:
        "Seat temporarily reserved"

      });

    }

    /*
    -------------------------------------------------
    WOMEN ONLY CHECK
    -------------------------------------------------
    */

    const [restrictionData] =
    await db.query(

      `
      SELECT *
      FROM seat_restrictions
      WHERE trip_id = ?
      AND restricted_seat_id = ?
      AND restriction_type = 'WomenOnly'
      `,

      [

        trip_id,
        seat_id

      ]

    );

    if (

      restrictionData.length > 0 &&

      passenger_gender === "Male"

    ) {

      return res.status(403).json({

        success: false,

        message:
        "This seat is reserved for female passengers"

      });

    }

    /*
    -------------------------------------------------
    CREATE BOOKING
    -------------------------------------------------
    */

    const [bookingResult] =
    await db.query(

      `
      INSERT INTO bookings (

        booking_code,
        user_id,
        trip_id,
        seat_number,
        passenger_name,
        passenger_gender,
        passenger_age,
        total_passengers,
        copassenger_preference,
        fare,
        booking_status

      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,

      [

        booking_code,
        user_id,
        trip_id,
        seat.seat_number,
        passenger_name,
        passenger_gender,
        passenger_age,
        total_passengers,
        copassenger_preference,
        fare,
        "Booked"

      ]

    );

    /*
    -------------------------------------------------
    WOMEN SAFETY LOGIC
    -------------------------------------------------
    */

   if (
  copassenger_preference === "Female Only" &&
  passenger_gender === "Female" &&
  seat.layout_side === "Right"
) {

      // ONLY RIGHT SIDE

      if (
        seat.layout_side === "right"
      ) {

        /*
        ---------------------------------------------
        FIND ADJACENT SEAT
        ---------------------------------------------
        */

        const [adjacentSeats] =
        await db.query(

          `
          SELECT *
          FROM seats
          WHERE bus_id = ?
          AND seat_group_id = ?
          AND id != ?
          `,

          [

            seat.bus_id,
            seat.seat_group_id,
            seat.id

          ]

        );

        if (
          adjacentSeats.length > 0
        ) {

          const nearbySeat =
          adjacentSeats[0];

          /*
          ---------------------------------------------
          CHECK EXISTING RESTRICTION
          ---------------------------------------------
          */

          const [existingRestriction] =
          await db.query(

            `
            SELECT *
            FROM seat_restrictions
            WHERE trip_id = ?
            AND restricted_seat_id = ?
            `,

            [

              trip_id,
              nearbySeat.id

            ]

          );

          /*
          ---------------------------------------------
          CREATE WOMENONLY LOCK
          ---------------------------------------------
          */

          if (
            existingRestriction.length === 0
          ) {

            await db.query(

              `
              INSERT INTO seat_restrictions (

                trip_id,
                restricted_seat_id,
                seat_number,
                restriction_type,
                created_by_booking_id

              )

              VALUES (?, ?, ?, ?, ?)
              `,

              [

                trip_id,
                nearbySeat.id,
                nearbySeat.seat_number,
                "WomenOnly",
                bookingResult.insertId

              ]

            );

          }

        }

      }

    }

    /*
    -------------------------------------------------
    SUCCESS
    -------------------------------------------------
    */

    return res.status(201).json({

      success: true,

      message:
      "Booking successful",

      booking_id:
      bookingResult.insertId

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Server Error"

    });

  }

};

/*
=====================================================
GET TRIP SEATS
=====================================================
*/

const getTripSeats =
async (req, res) => {

  try {

    await expireReservations();

    const {
      trip_id
    } = req.params;

    /*
    -------------------------------------------------
    GET TRIP
    -------------------------------------------------
    */

    const [tripData] =
    await db.query(

      `
      SELECT *
      FROM trips
      WHERE id = ?
      `,

      [trip_id]

    );

    if (
      tripData.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
        "Trip not found"

      });

    }

    const trip =
    tripData[0];

    /*
    -------------------------------------------------
    GET BUS SEATS
    -------------------------------------------------
    */

    const [seats] =
    await db.query(

      `
      SELECT *
      FROM seats
      WHERE bus_id = ?
      ORDER BY id ASC
      `,

      [trip.bus_id]

    );

    /*
    -------------------------------------------------
    GET BOOKINGS
    -------------------------------------------------
    */

    const [bookings] =
    await db.query(

      `
      SELECT seat_number
      FROM bookings
      WHERE trip_id = ?
      AND booking_status = 'Booked'
      `,

      [trip_id]

    );

    /*
    -------------------------------------------------
    GET ACTIVE RESERVATIONS
    -------------------------------------------------
    */

    const [activeReservations] =
    await db.query(

      `
      SELECT seat_number
      FROM reservation_requests
      WHERE trip_id = ?
      AND reservation_status = 'Pending'
      `,

      [trip_id]

    );

    /*
    -------------------------------------------------
    GET WOMEN LOCKS
    -------------------------------------------------
    */

    const [womenLocks] =
    await db.query(

      `
      SELECT seat_number
      FROM seat_restrictions
      WHERE trip_id = ?
      AND restriction_type = 'WomenOnly'
      `,

      [trip_id]

    );

    /*
    -------------------------------------------------
    RESPONSE
    -------------------------------------------------
    */

    return res.status(200).json({

      success: true,

      seats,

      bookedSeats:
      bookings.map(
        (b) => b.seat_number
      ),

      reservedSeats:
      activeReservations.map(
        (r) => r.seat_number
      ),

      womenLockedSeats:
      womenLocks.map(
        (w) => w.seat_number
      )

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Server Error"

    });

  }

};

/*
=====================================================
CANCEL BOOKING
=====================================================
*/

const cancelBooking =
async (req, res) => {

  try {

    const {
      booking_id
    } = req.params;

    /*
    -------------------------------------------------
    GET BOOKING
    -------------------------------------------------
    */

    const [bookingData] =
    await db.query(

      `
      SELECT *
      FROM bookings
      WHERE id = ?
      `,

      [booking_id]

    );

    if (
      bookingData.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
        "Booking not found"

      });

    }

    const booking =
    bookingData[0];

    /*
    -------------------------------------------------
    ALREADY CANCELLED
    -------------------------------------------------
    */

    if (
      booking.booking_status ===
      "Cancelled"
    ) {

      return res.status(400).json({

        success: false,

        message:
        "Booking already cancelled"

      });

    }

   /*
-------------------------------------------------
CALCULATE REFUND
-------------------------------------------------
*/

let refundPercentage = 80;

let refundAmount =
(
  booking.fare *
  refundPercentage
) / 100;

/*
-------------------------------------------------
MOVE TO CANCELLED BOOKINGS
-------------------------------------------------
*/

await db.query(

  `
  INSERT INTO cancelled_bookings (

    original_booking_id,
    booking_code,
    user_id,
    trip_id,
    seat_number,
    passenger_name,
    passenger_gender,
    passenger_age,
    copassenger_preference,
    fare,
    refund_percentage,
    refund_amount,
    refund_status

  )

  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  [

    booking.id,
    booking.booking_code,
    booking.user_id,
    booking.trip_id,
    booking.seat_number,
    booking.passenger_name,
    booking.passenger_gender,
    booking.passenger_age,
    booking.copassenger_preference,
    booking.fare,
    refundPercentage,
    refundAmount,
    "Pending"

  ]

);

/*
-------------------------------------------------
DELETE FROM BOOKINGS
-------------------------------------------------
*/

await db.query(

  `
  DELETE FROM bookings
  WHERE id = ?
  `,

  [booking_id]

);

/*
-------------------------------------------------
MAKE SEAT AVAILABLE AGAIN
-------------------------------------------------
*/

await db.query(

  `
  UPDATE seats
  SET seat_status = 'Available'
  WHERE bus_id = (
    SELECT bus_id
    FROM trips
    WHERE id = ?
  )
  AND seat_number = ?
  `,

  [
    booking.trip_id,
    booking.seat_number
  ]

);

  /*
-------------------------------------------------
REMOVE WOMEN LOCKS
-------------------------------------------------
*/

// Find seat id of cancelled seat

const [seatData] = await db.query(
  `
  SELECT id
  FROM seats
  WHERE seat_number = ?
  AND bus_id = (
    SELECT bus_id
    FROM trips
    WHERE id = ?
  )
  `,
  [
    booking.seat_number,
    booking.trip_id
  ]
);

if (seatData.length > 0) {

  const seatId = seatData[0].id;

  await db.query(
    `
    DELETE FROM seat_restrictions
    WHERE trip_id = ?
    AND (
      created_by_booking_id = ?
      OR restricted_seat_id = ?
    )
    `,
    [
      booking.trip_id,
      booking.id,
      seatId
    ]
  );

}

await db.query(
  `
  UPDATE seats
  SET seat_status = 'Available'
  WHERE seat_status = 'WomenOnly'
  AND bus_id = (
    SELECT bus_id
    FROM trips
    WHERE id = ?
  )
  `,
  [booking.trip_id]
);

    /*
    -------------------------------------------------
    SUCCESS
    -------------------------------------------------
    */

    return res.status(200).json({

      success: true,

      message:
      "Booking cancelled successfully"

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Server Error"

    });

  }

};

/*
=====================================================
GET MY BOOKINGS
=====================================================
*/

const getMyBookings =
async (req, res) => {

  try {

    console.log("REQ USER:", req.user);

    const userId =
      req.user.id;

    const [bookings] =
      await db.query(

        `
        SELECT

          b.*,

          t.source_city,
          t.destination_city,
          t.departure_datetime,

          bus.bus_name,
          bus.bus_number

        FROM bookings b

        JOIN trips t
        ON b.trip_id = t.id

        JOIN buses bus
        ON t.bus_id = bus.id

        WHERE b.user_id = ?

        ORDER BY b.booked_at DESC
        `,

        [userId]

      );

    return res.status(200).json({

      success: true,

      bookings

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Server Error"

    });

  }

};

/*
=====================================================
GET MY CANCELLED BOOKINGS
=====================================================
*/

const getMyCancelledBookings =
async (req, res) => {

  try {

    const userId =
      req.user.id;

    const [bookings] =
      await db.query(

        `
        SELECT *
        FROM cancelled_bookings
        WHERE user_id = ?
        ORDER BY cancelled_at DESC
        `,

        [userId]

      );

    return res.status(200).json({

      success: true,

      bookings

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Server Error"

    });

  }

};

const getTripBookings = async (req, res) => {

  try {

    const { trip_id } = req.params;

    const [bookings] = await db.query(
      `
      SELECT *
      FROM bookings
      WHERE trip_id = ?
      ORDER BY booked_at DESC
      `,
      [trip_id]
    );

    res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};




const getTripCancelledBookings = async (req, res) => {

  try {

    const { trip_id } = req.params;

    const [bookings] = await db.query(
      `
      SELECT *
      FROM cancelled_bookings
      WHERE trip_id = ?
      ORDER BY cancelled_at DESC
      `,
      [trip_id]
    );

    res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

const getOperatorTripBookings =
async (req, res) => {

  try {

    const { trip_id } =
      req.params;

    const operator_id =
      req.user.id;

    const [trip] =
      await db.query(
        `
        SELECT id
        FROM trips
        WHERE id = ?
        AND operator_id = ?
        `,
        [trip_id, operator_id]
      );

    if (trip.length === 0) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });

    }

    const [bookings] =
      await db.query(
        `
        SELECT *
        FROM bookings
        WHERE trip_id = ?
        ORDER BY booked_at DESC
        `,
        [trip_id]
      );

    res.status(200).json({
      success: true,
      bookings
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

const getOperatorCancelledBookings =
async (req, res) => {

  try {

    const { trip_id } =
      req.params;

    const operator_id =
      req.user.id;

    const [trip] =
      await db.query(
        `
        SELECT id
        FROM trips
        WHERE id = ?
        AND operator_id = ?
        `,
        [trip_id, operator_id]
      );

    if (trip.length === 0) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });

    }

    const [bookings] =
      await db.query(
        `
        SELECT *
        FROM cancelled_bookings
        WHERE trip_id = ?
        ORDER BY cancelled_at DESC
        `,
        [trip_id]
      );

    res.status(200).json({
      success: true,
      bookings
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

module.exports = {

  createBooking,
  getTripSeats,
  cancelBooking,
  getMyBookings,
  getMyCancelledBookings,

  getTripBookings,
  getTripCancelledBookings,

  getOperatorTripBookings,
  getOperatorCancelledBookings

};