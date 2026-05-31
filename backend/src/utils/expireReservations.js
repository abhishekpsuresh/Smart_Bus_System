const db = require("../config/db");

const expireReservations = async () => {

  // GET EXPIRED RESERVATIONS

  const [expiredReservations] =
    await db.query(
      `SELECT * FROM reservation_requests
       WHERE reservation_status = 'Pending'
       AND reservation_expires_at < NOW()`
    );

  for (const reservation of expiredReservations) {

    // GET PASSENGERS

    const [passengers] =
      await db.query(
        `SELECT * FROM reservation_passengers
         WHERE reservation_request_id = ?`,
        [reservation.id]
      );

    // RESET MAIN SEATS

    for (const passenger of passengers) {

      await db.query(
        `UPDATE seats
         SET seat_status = 'Available'
         WHERE id = ?`,
        [passenger.seat_id]
      );

    }

    // GET WOMEN ONLY RESTRICTIONS

    const [restrictions] =
      await db.query(
        `SELECT * FROM seat_restrictions
         WHERE trip_id = ?`,
        [reservation.trip_id]
      );

    // RESET WOMENONLY SEATS

    for (const restriction of restrictions) {

      await db.query(
        `UPDATE seats
         SET seat_status = 'Available'
         WHERE id = ?`,
        [restriction.restricted_seat_id]
      );

    }

  }

  // UPDATE RESERVATION STATUS

  await db.query(
    `UPDATE reservation_requests
     SET reservation_status = 'Expired'
     WHERE reservation_status = 'Pending'
     AND reservation_expires_at < NOW()`
  );

};

module.exports =
  expireReservations;