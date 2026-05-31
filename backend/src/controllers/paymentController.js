const db = require("../config/db");

const expireReservations =
require("../utils/expireReservations");

// CREATE PAYMENT

const createPayment = async (req, res) => {

  try {

    // AUTO EXPIRE

    await expireReservations();

    const {
      reservation_request_id,
      payment_method
    } = req.body;

    // GET RESERVATION

    const [reservationData] =
      await db.query(
        `SELECT * FROM reservation_requests
         WHERE id = ?`,
        [reservation_request_id]
      );

    if (reservationData.length === 0) {

      return res.status(404).json({
        message: "Reservation not found"
      });

    }

    const reservation =
      reservationData[0];

    // CHECK STATUS

    if (
      reservation.reservation_status !==
      "Pending"
    ) {

      return res.status(400).json({
        message:
        "Reservation expired or invalid"
      });

    }

    // CHECK DUPLICATE PAYMENT

    const [existingPayment] =
      await db.query(
        `SELECT * FROM payments
         WHERE reservation_request_id = ?
         AND payment_status = 'Success'`,
        [reservation_request_id]
      );

    if (existingPayment.length > 0) {

      return res.status(400).json({
        message:
        "Payment already completed"
      });

    }

    // GET PASSENGERS

    const [passengers] =
      await db.query(
        `SELECT * FROM reservation_passengers
         WHERE reservation_request_id = ?`,
        [reservation_request_id]
      );

    const seatIds =
      passengers.map(
        passenger => passenger.seat_id
      ).join(",");

    const seatNumbers =
      passengers.map(
        passenger => passenger.seat_number
      ).join(",");

    // CREATE PAYMENT

    const [paymentResult] =
      await db.query(
        `INSERT INTO payments (
          reservation_request_id,
          booking_code,
          user_id,
          trip_id,
          seat_id,
          seat_number,
          amount,
          payment_method
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reservation_request_id,
          reservation.reservation_code,
          reservation.user_id,
          reservation.trip_id,
          seatIds,
          seatNumbers,
          reservation.total_amount,
          payment_method
        ]
      );

    res.status(201).json({
      message: "Payment created",
      payment_id:
      paymentResult.insertId,
      payment_status: "Pending"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

// VERIFY PAYMENT

const verifyPayment = async (req, res) => {

  try {

    // AUTO EXPIRE

    await expireReservations();

    const {
      payment_id,
      payment_success
    } = req.body;

    // GET PAYMENT

    const [paymentData] =
      await db.query(
        `SELECT * FROM payments
         WHERE id = ?`,
        [payment_id]
      );

    if (paymentData.length === 0) {

      return res.status(404).json({
        message: "Payment not found"
      });

    }

    const payment =
      paymentData[0];

    // PREVENT DOUBLE VERIFY

    if (
      payment.payment_status ===
      "Success"
    ) {

      return res.status(400).json({
        message:
        "Payment already verified"
      });

    }

    // PAYMENT FAILED

    if (!payment_success) {

      await db.query(
        `UPDATE payments
         SET payment_status = 'Failed'
         WHERE id = ?`,
        [payment_id]
      );

      await db.query(
        `UPDATE reservation_requests
         SET reservation_status = 'Expired'
         WHERE id = ?`,
        [payment.reservation_request_id]
      );

      // RELEASE SEATS

      const [passengers] =
        await db.query(
          `SELECT * FROM reservation_passengers
           WHERE reservation_request_id = ?`,
          [payment.reservation_request_id]
        );

      for (const passenger of passengers) {

        await db.query(
          `UPDATE seats
           SET seat_status = 'Available'
           WHERE id = ?`,
          [passenger.seat_id]
        );

      }

      return res.status(400).json({
        message: "Payment failed"
      });

    }

    // PAYMENT SUCCESS

    const transactionId =
      "TXN" + Date.now();

    await db.query(
      `UPDATE payments
       SET payment_status = 'Success',
           transaction_id = ?
       WHERE id = ?`,
      [
        transactionId,
        payment_id
      ]
    );

    // GET RESERVATION

    const [reservationData] =
      await db.query(
        `SELECT * FROM reservation_requests
         WHERE id = ?`,
        [payment.reservation_request_id]
      );

    const reservation =
      reservationData[0];

    // GET PASSENGERS

    const [passengers] =
      await db.query(
        `SELECT * FROM reservation_passengers
         WHERE reservation_request_id = ?`,
        [payment.reservation_request_id]
      );

    // CREATE BOOKINGS

    for (const passenger of passengers) {

      const [seatData] =
        await db.query(
          `SELECT * FROM seats
           WHERE id = ?`,
          [passenger.seat_id]
        );

      const seat =
        seatData[0];

      // CREATE BOOKING

      const [bookingResult] =
        await db.query(
          `INSERT INTO bookings (
            booking_code,
            user_id,
            trip_id,
            seat_number,
            passenger_name,
            passenger_gender,
            passenger_age,
            copassenger_preference,
            fare,
            booking_status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reservation.reservation_code,
            reservation.user_id,
            reservation.trip_id,
            seat.seat_number,
            passenger.passenger_name,
            passenger.passenger_gender,
            passenger.passenger_age,
            passenger.copassenger_preference,
            reservation.total_amount,
            'Booked'
          ]
        );

      // UPDATE SEAT STATUS

      await db.query(
        `UPDATE seats
         SET seat_status = 'Booked'
         WHERE id = ?`,
        [passenger.seat_id]
      );

     let lockSeatNumber = null;

if (seat.seat_number.startsWith("RUW")) {
  lockSeatNumber =
    seat.seat_number.replace(
      "RUW",
      "RUA"
    );
}

else if (
  seat.seat_number.startsWith("RUA")
) {
  lockSeatNumber =
    seat.seat_number.replace(
      "RUA",
      "RUW"
    );
}

else if (
  seat.seat_number.startsWith("RLW")
) {
  lockSeatNumber =
    seat.seat_number.replace(
      "RLW",
      "RLA"
    );
}

else if (
  seat.seat_number.startsWith("RLA")
) {
  lockSeatNumber =
    seat.seat_number.replace(
      "RLA",
      "RLW"
    );
}

if (lockSeatNumber) {

  const [adjacentSeat] =
    await db.query(
      `SELECT *
       FROM seats
       WHERE seat_number = ?
       LIMIT 1`,
      [lockSeatNumber]
    );

  if (adjacentSeat.length > 0) {

    const nearbySeat =
      adjacentSeat[0];

    console.log(
      "LOCKING:",
      nearbySeat.seat_number
    );

    await db.query(
      `INSERT INTO seat_restrictions (
        trip_id,
        restricted_seat_id,
        seat_number,
        restriction_type,
        created_by_booking_id
      )
      VALUES (?, ?, ?, ?, ?)`,

      [
        reservation.trip_id,
        nearbySeat.id,
        nearbySeat.seat_number,
        "WomenOnly",
        bookingResult.insertId
      ]
    );

    await db.query(
      `UPDATE seats
       SET seat_status = 'WomenOnly'
       WHERE id = ?`,
      [nearbySeat.id]
    );

  }

}
}

    // CONFIRM RESERVATION

    await db.query(
      `UPDATE reservation_requests
       SET reservation_status = 'Confirmed'
       WHERE id = ?`,
      [payment.reservation_request_id]
    );

    res.status(200).json({
      message: "Payment successful",
      transaction_id:
      transactionId
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

module.exports = {
  createPayment,
  verifyPayment
};