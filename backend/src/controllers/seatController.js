const db =
require("../config/db");

/*
---------------------------------------------------
GET SEATS BY TRIP
---------------------------------------------------
*/

const getSeatsByTrip =
async (req, res) => {

  try {

    const {
      tripId
    } = req.params;

    // GET TRIP

    const [trips] =
    await db.query(

      `

        SELECT *

        FROM trips

        WHERE id = ?

      `,

      [tripId]

    );

    // TRIP NOT FOUND

    if (trips.length === 0) {

      return res.status(404).json({

        success: false,

        message:
        "Trip not found"

      });

    }

    const busId =
    trips[0].bus_id;

    // GET SEATS

    const [seats] =
    await db.query(

      `

        SELECT *

        FROM seats

        WHERE trip_id = ?

        ORDER BY id ASC

      `,

      [tripId]

    );

    return res.status(200).json({

      success: true,

      seats

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch seats"

    });

  }

};

/*
---------------------------------------------------
UPDATE SEAT STATUS
---------------------------------------------------
*/

const updateSeatStatus =
async (req, res) => {

  try {

    const {
      seat_id
    } = req.params;

    const {
      seat_status
    } = req.body;

    await db.query(

      `

        UPDATE seats

        SET

          seat_status = ?,
          updated_at = CURRENT_TIMESTAMP

        WHERE id = ?

      `,

      [

        seat_status,
        seat_id

      ]

    );

    return res.status(200).json({

      success: true,

      message:
      "Seat updated successfully"

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to update seat"

    });

  }

};

module.exports = {

  getSeatsByTrip,

  updateSeatStatus

};