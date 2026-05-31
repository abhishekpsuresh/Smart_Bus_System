const db = require("../config/db");


/*
---------------------------------------------------
GENERATE SEATS
---------------------------------------------------
*/
const generateSeats = (busId, totalSeats) => {

  const seats = [];

  /*
  ===================================================
  ROW COUNT

  30 seats = 5 rows
  36 seats = 6 rows
  42 seats = 7 rows

  EACH ROW:

  LOWER:
  LL + RLA + RLW

  UPPER:
  LU + RUA + RUW

  TOTAL = 6 seats per row
  ===================================================
  */

  const rows = totalSeats / 6;

  for (let i = 1; i <= rows; i++) {

    /*
    ===================================================
    LOWER LEFT
    ===================================================
    */

    seats.push([
      busId,
      `LL${i}`,
      "Lower",
      "Left",
      "Single",
      i,
      "Available"
    ]);

    /*
    ===================================================
    LOWER RIGHT AISLE
    ===================================================
    */

    seats.push([
      busId,
      `RLA${i}`,
      "Lower",
      "Right",
      "Aisle",
      i,
      "Available"
    ]);

    /*
    ===================================================
    LOWER RIGHT WINDOW
    ===================================================
    */

    seats.push([
      busId,
      `RLW${i}`,
      "Lower",
      "Right",
      "Window",
      i,
      "Available"
    ]);

    /*
    ===================================================
    UPPER LEFT
    ===================================================
    */

    seats.push([
      busId,
      `LU${i}`,
      "Upper",
      "Left",
      "Single",
      i,
      "Available"
    ]);

    /*
    ===================================================
    UPPER RIGHT AISLE
    ===================================================
    */

    seats.push([
      busId,
      `RUA${i}`,
      "Upper",
      "Right",
      "Aisle",
      i,
      "Available"
    ]);

    /*
    ===================================================
    UPPER RIGHT WINDOW
    ===================================================
    */

    seats.push([
      busId,
      `RUW${i}`,
      "Upper",
      "Right",
      "Window",
      i,
      "Available"
    ]);

  }

  return seats;

};

// ======================================================
// GENERATE TRIP CODE
// ======================================================

const generateTripCode = async () => {

  const [rows] = await db.query(
    `
      SELECT id
      FROM trips
      ORDER BY id DESC
      LIMIT 1
    `
  );

  let nextId = 1;

  if (rows.length > 0) {
    nextId = rows[0].id + 1;
  }

  return `TRIP${String(nextId).padStart(3, "0")}`;

};

// ======================================================
// ADD TRIP
// ======================================================

const addTrip = async (req, res) => {

  try {

    const {
      bus_id,
      source_city,
      destination_city,
      departure_datetime,
      arrival_datetime,
      trip_status,
      fare
    } = req.body;

    const operator_id = req.user.id;

    // CHECK BUS OWNERSHIP

    const [buses] = await db.query(
      `
        SELECT *
        FROM buses
        WHERE id = ? AND operator_id = ?
      `,
      [bus_id, operator_id]
    );

    if (buses.length === 0) {

      return res.status(403).json({
        success: false,
        message: "Invalid bus selected"
      });

    }

    const trip_code =
      await generateTripCode();

    // INSERT TRIP

  const [tripResult] =
await db.query(
  `
  INSERT INTO trips (
    trip_code,
    bus_id,
    source_city,
    destination_city,
    departure_datetime,
    arrival_datetime,
    trip_status,
    fare,
    operator_id
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    trip_code,
    bus_id,
    source_city,
    destination_city,
    departure_datetime,
    arrival_datetime,
    trip_status,
    fare,
    operator_id
  ]
);

const tripId =
tripResult.insertId;

const [busData] =
await db.query(
  `
  SELECT total_seats
  FROM buses
  WHERE id = ?
  `,
  [bus_id]
);

const totalSeats =
busData[0].total_seats;

const generatedSeats =
generateSeats(
  bus_id,
  totalSeats
);

const tripSeats =
generatedSeats.map(
  seat => [
    tripId,
    seat[0], // bus_id
    seat[1],
    seat[2],
    seat[3],
    seat[4],
    seat[5],
    seat[6]
  ]
);

await db.query(
  `
  INSERT INTO seats (
    trip_id,
    bus_id,
    seat_number,
    seat_type,
    layout_side,
    seat_position,
    seat_group_id,
    seat_status
  )
  VALUES ?
  `,
  [tripSeats]
);

    return res.status(201).json({
      success: true,
      message: "Trip added successfully"
    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add trip"
    });

  }

};

// ======================================================
// GET OPERATOR TRIPS
// ======================================================

const getOperatorTrips = async (req, res) => {

  try {

    const operator_id =
      req.user.id;

    const [trips] = await db.query(
      `
        SELECT
          trips.*,
          buses.bus_name,
          buses.bus_number
        FROM trips
        INNER JOIN buses
        ON trips.bus_id = buses.id
        WHERE trips.operator_id = ?
        ORDER BY trips.id DESC
      `,
      [operator_id]
    );

    return res.status(200).json({
      success: true,
      trips
    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trips"
    });

  }

};

// ======================================================
// GET SINGLE TRIP
// ======================================================

const getSingleTrip = async (req, res) => {

  try {

    const { id } = req.params;

    const [trips] = await db.query(
      `
        SELECT
          trips.*,
          buses.bus_name,
          buses.bus_number,
          buses.bus_type,
          buses.bus_body_type,
          buses.total_seats
        FROM trips
        INNER JOIN buses
        ON trips.bus_id = buses.id
        WHERE trips.id = ?
      `,
      [id]
    );

    if (trips.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });

    }

    return res.status(200).json(
      trips[0]
    );

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trip"
    });

  }

};

// ======================================================
// UPDATE TRIP
// ======================================================

const updateTrip = async (req, res) => {

  try {

    const { id } =
      req.params;

    const operator_id =
      req.user.id;

    const {
      bus_id,
      source_city,
      destination_city,
      departure_datetime,
      arrival_datetime,
      trip_status,
      fare
    } = req.body;

    await db.query(
      `
        UPDATE trips
        SET
          bus_id = ?,
          source_city = ?,
          destination_city = ?,
          departure_datetime = ?,
          arrival_datetime = ?,
          trip_status = ?,
          fare = ?
        WHERE id = ?
        AND operator_id = ?
      `,
      [
        bus_id,
        source_city,
        destination_city,
        departure_datetime,
        arrival_datetime,
        trip_status,
        fare,
        id,
        operator_id
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully"
    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update trip"
    });

  }

};

// ======================================================
// DELETE TRIP
// ======================================================

const deleteTrip = async (req, res) => {

  try {

    const { id } =
      req.params;

    const operator_id =
      req.user.id;

      await db.query(
  "DELETE FROM seat_restrictions WHERE trip_id = ?",
  [id]
);

await db.query(
  "DELETE FROM seats WHERE trip_id = ?",
  [id]
);

    await db.query(
      `
        DELETE FROM trips
        WHERE id = ?
        AND operator_id = ?
      `,
      [id, operator_id]
    );

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully"
    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete trip"
    });

  }

};


/*
=====================================================
GET ALL TRIPS (ADMIN)
=====================================================
*/

const getAllTrips = async (req, res) => {

  try {

    const [trips] = await db.query(

      `
      SELECT
        trips.*,
        buses.bus_name,
        buses.bus_number
      FROM trips
      INNER JOIN buses
      ON trips.bus_id = buses.id
      ORDER BY trips.id DESC
      `

    );

    return res.status(200).json({

      success: true,

      trips

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch trips"

    });

  }

};



// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  addTrip,
  getOperatorTrips,
  getSingleTrip,
  updateTrip,
  deleteTrip,
  getAllTrips
};