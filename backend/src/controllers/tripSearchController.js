const db = require("../config/db");

const searchTrips = async (req, res) => {

  try {

    let {
      source_city,
      destination_city,
      travel_date
    } = req.query;

    /*
    ============================================
    VALIDATION
    ============================================
    */

    if (

      !source_city ||
      !destination_city ||
      !travel_date

    ) {

      return res.status(400).json({

        success: false,
        message: "All fields are required"

      });

    }

    /*
    ============================================
    CLEAN VALUES
    ============================================
    */

    source_city =
      source_city.trim().toLowerCase();

    destination_city =
      destination_city.trim().toLowerCase();

    console.log("Searching with:", {

      source_city,
      destination_city,
      travel_date

    });

    /*
    ============================================
    SEARCH QUERY
    ============================================
    */

    const [trips] = await db.query(

      `
      SELECT

        trips.*,

        buses.bus_name,
        buses.bus_number,
        buses.bus_type,
        buses.bus_body_type,
        buses.total_seats,

        users.full_name AS operator_name,

        (

          SELECT COUNT(*)

          FROM seats

          WHERE seats.bus_id = buses.id

          AND seats.seat_status = 'Available'

        ) AS available_seats

      FROM trips

      INNER JOIN buses
      ON trips.bus_id = buses.id

      INNER JOIN users
      ON trips.operator_id = users.id

      WHERE

        LOWER(TRIM(trips.source_city))
        = ?

        AND

        LOWER(TRIM(trips.destination_city))
        = ?

        AND

        DATE(trips.departure_datetime)
        = DATE(?)

        AND

        trips.trip_status != 'Cancelled'

      ORDER BY trips.departure_datetime ASC
      `,

      [
        source_city,
        destination_city,
        travel_date
      ]

    );

    console.log("Trips found:", trips);

    return res.status(200).json({

      success: true,
      trips

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: "Server error"

    });

  }

};

module.exports = {
  searchTrips
};