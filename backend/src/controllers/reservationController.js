const db = require("../config/db");

// CREATE RESERVATION

const createReservation = async (req, res) => {

  try {

   const {
  reservation_code,
  trip_id,
  total_amount,
  passengers
} = req.body;

const user_id = req.user.id;

    // VALIDATE PASSENGERS

    if (
      !passengers ||
      passengers.length === 0
    ) {

      return res.status(400).json({
        message: "Passengers required"
      });

    }

    // EXPIRE OLD RESERVATIONS

    const [expiredReservations] =
      await db.query(
        `SELECT * FROM reservation_requests
         WHERE reservation_status = 'Pending'
         AND reservation_expires_at < NOW()`
      );

    for (const reservation of expiredReservations) {

      const [reservationPassengers] =
        await db.query(
          `SELECT * FROM reservation_passengers
           WHERE reservation_request_id = ?`,
          [reservation.id]
        );

      for (const passenger of reservationPassengers) {

        await db.query(
          `UPDATE seats
           SET seat_status = 'Available'
           WHERE id = ?`,
          [passenger.seat_id]
        );

      }

    }

    await db.query(
      `UPDATE reservation_requests
       SET reservation_status = 'Expired'
       WHERE reservation_status = 'Pending'
       AND reservation_expires_at < NOW()`
    );

    // STORE UPDATED PASSENGERS

    const updatedPassengers = [];

    for (const passenger of passengers) {

      // GET SEAT

      const [seatData] = await db.query(
        `SELECT * FROM seats
         WHERE id = ?`,
        [passenger.seat_id]
      );

      if (seatData.length === 0) {

        return res.status(404).json({
          message: "Seat not found"
        });

      }

      const seat =
        seatData[0];

      // CHECK BOOKED

      if (
        seat.seat_status === "Booked"
      ) {

        return res.status(400).json({
          message:
          `${seat.seat_number} already booked`
        });

      }

      // CHECK LOCKED

      if (
        seat.seat_status === "Locked"
      ) {

        return res.status(400).json({
          message:
          `${seat.seat_number} temporarily locked`
        });

      }

      updatedPassengers.push({
        ...passenger,
        seat_number:
        seat.seat_number
      });

    }

    // SEAT IDS

    const seatIds =
      updatedPassengers.map(
        passenger => passenger.seat_id
      ).join(",");

    // SEAT NUMBERS

    const seatNumbers =
      updatedPassengers.map(
        passenger => passenger.seat_number
      ).join(",");

    // CREATE RESERVATION

    const [reservationResult] =
      await db.query(
        `INSERT INTO reservation_requests (
          reservation_code,
          user_id,
          trip_id,
          seat_id,
          seat_number,
          total_amount,
          reservation_status,
          reservation_expires_at
        )
        VALUES (
          ?, ?, ?, ?, ?, ?,
          'Pending',
          NOW() + INTERVAL 10 MINUTE
        )`,
        [
          reservation_code,
          user_id,
          trip_id,
          seatIds,
          seatNumbers,
          total_amount
        ]
      );

    const reservationId =
      reservationResult.insertId;

    // STORE PASSENGERS

    for (const passenger of updatedPassengers) {

      await db.query(
        `INSERT INTO reservation_passengers (
          reservation_request_id,
          seat_id,
          seat_number,
          passenger_name,
          passenger_gender,
          passenger_age,
          copassenger_preference
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          reservationId,
          passenger.seat_id,
          passenger.seat_number,
          passenger.passenger_name,
          passenger.passenger_gender,
          passenger.passenger_age,
          passenger.copassenger_preference
        ]
      );

      // LOCK SEAT

      await db.query(
        `UPDATE seats
         SET seat_status = 'Locked'
         WHERE id = ?`,
        [passenger.seat_id]
      );

    }

    res.status(201).json({
      message: "Reservation created",
      reservation_request_id:
      reservationId
    });

  } catch (error) {

    console.log(error.sqlMessage);
console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

module.exports = {
  createReservation
};