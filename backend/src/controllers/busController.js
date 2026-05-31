const db =
require("../config/db");


/*
---------------------------------------------------
ADD BUS
---------------------------------------------------
*/

const addBus =
async (req, res) => {

  try {

    /*
    ===================================================
    BODY DATA
    ===================================================
    */

    const {

      bus_name,
      bus_number,
      bus_type,
      bus_body_type,
      total_seats,
      manufacture_year

    } = req.body;

    /*
    ===================================================
    OPERATOR ID FROM JWT
    ===================================================
    */

    const operator_id =
    req.user.id;

    /*
    ===================================================
    GET OPERATOR NAME
    ===================================================
    */

    const [userRows] =
    await db.query(

      `

        SELECT full_name

        FROM users

        WHERE id = ?

      `,

      [operator_id]

    );

    /*
    ===================================================
    CHECK USER
    ===================================================
    */

    if (
      userRows.length === 0
    ) {

      return res.status(404)
      .json({

        success: false,

        message:
        "Operator not found"

      });

    }

    /*
    ===================================================
    OPERATOR NAME
    ===================================================
    */

    const operator_name =
    userRows[0].full_name;

    /*
    ===================================================
    CHECK DUPLICATE BUS
    ===================================================
    */

    const [existingBus] =
    await db.query(

      `

        SELECT id

        FROM buses

        WHERE bus_number = ?

      `,

      [bus_number]

    );

    if (
      existingBus.length > 0
    ) {

      return res.status(400)
      .json({

        success: false,

        message:
        "Bus number already exists"

      });

    }

    /*
    ===================================================
    INSERT BUS
    ===================================================
    */

    const [result] =
    await db.query(

      `

        INSERT INTO buses (

          bus_name,
          bus_number,
          bus_type,
          bus_body_type,
          total_seats,
          operator_name,
          manufacture_year,
          operator_id

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)

      `,

      [

        bus_name,
        bus_number,
        bus_type,
        bus_body_type,
        total_seats,
        operator_name,
        manufacture_year,
        operator_id

      ]

    );

    /*
    ===================================================
    SUCCESS
    ===================================================
    */

  return res.status(201).json({
  success: true,
  message: "Bus created successfully",
  busId: result.insertId
});

  }

  catch (error) {

    console.log(error);

    return res.status(500)
    .json({

      success: false,

      message:
      "Server error"

    });

  }

};

/*
---------------------------------------------------
GET ALL BUSES
---------------------------------------------------
*/

const getAllBuses =
async (req, res) => {

  try {

    const operatorId =
    req.user.id;

    const [buses] =
    await db.query(

      `

        SELECT *

        FROM buses

        WHERE operator_id = ?

        ORDER BY created_at DESC

      `,

      [operatorId]

    );

    return res.status(200)
    .json({

      success: true,

      buses

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500)
    .json({

      success: false,

      message:
      "Server error"

    });

  }

};

/*
---------------------------------------------------
UPDATE BUS
---------------------------------------------------
*/

const updateBus = async (req, res) => {

  try {

    const busId = req.params.id;

    const {

      bus_name,
      bus_number,
      bus_type,
      bus_body_type,
      manufacture_year

    } = req.body;

    /*
    ===================================================
    GET CURRENT BUS
    ===================================================
    */

    const [currentBusData] =
      await db.query(

        `
        SELECT *
        FROM buses
        WHERE id = ?
        `,

        [busId]

      );

    if (
      currentBusData.length === 0
    ) {

      return res.status(404).json({

        success: false,
        message: "Bus not found"

      });

    }

    const currentBus =
      currentBusData[0];

    /*
    ===================================================
    CHECK DUPLICATE BUS NUMBER
    ===================================================
    */

    const [duplicateBus] =
      await db.query(

        `
        SELECT *
        FROM buses
        WHERE bus_number = ?
        AND id != ?
        `,

        [
          bus_number,
          busId
        ]

      );

    if (
      duplicateBus.length > 0
    ) {

      return res.status(400).json({

        success: false,
        message:
        "Bus number already exists"

      });

    }


    /*
    ===================================================
    UPDATE BUS
    ===================================================
    */

    await db.query(

      `
      UPDATE buses

      SET

        bus_name = ?,
        bus_number = ?,
        bus_type = ?,
        bus_body_type = ?,
        manufacture_year = ?,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = ?
      `,

      [

        bus_name,
        bus_number,
        bus_type,
        bus_body_type,
        manufacture_year,
        busId

      ]

    );
    return res.status(200).json({

  success: true,
  message: "Bus updated successfully"

});

} catch (error) {

  console.log(error);

  return res.status(500).json({

    success: false,
    message: "Server error"

  });

}

};

  
/*
---------------------------------------------------
DELETE BUS
---------------------------------------------------
*/

const deleteBus =
async (req, res) => {

  try {

    const busId =
      req.params.id;

    await db.query(

      `
      DELETE FROM buses
      WHERE id = ?
      `,

      [busId]

    );

    return res.status(200).json({

      success: true,

      message:
        "Bus deleted successfully"

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Server error"

    });

  }

};

const uploadBusImages =
async (req, res) => {

  try {

    const busId =
      req.params.id;

    const files =
      req.files || [];

    if (files.length === 0) {

      return res.status(400).json({

        success: false,
        message: "No images uploaded"

      });

    }

    for (const file of files) {

      await db.query(

        `
        INSERT INTO bus_images
        (
          bus_id,
          image_path
        )
        VALUES (?,?)
        `,

        [
          busId,
          `/uploads/buses/${file.filename}`
        ]

      );

    }

    return res.status(200).json({

      success: true,
      message:
      "Images uploaded successfully"

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

const getBusImages = async (req, res) => {

  try {

    const busId = req.params.id;

    const [images] = await db.query(

      `
      SELECT *
      FROM bus_images
      WHERE bus_id = ?
      ORDER BY id DESC
      `,

      [busId]

    );

    return res.status(200).json({

      success: true,

      images

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

  addBus,

  getAllBuses,

  updateBus,

  deleteBus,

  uploadBusImages,

  getBusImages

};