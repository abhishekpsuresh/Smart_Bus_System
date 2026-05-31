const db =
require("../config/db");

const bcrypt =
require("bcryptjs");


// SEND OPERATOR REQUEST

exports.sendOperatorRequest =
async (req, res) => {

  try {

    const {

      full_name,
      email,
      phone,
      password

    } = req.body;

    // CHECK EXISTING REQUEST

    const [existingRequest] =
    await db.query(

      `
      SELECT *
      FROM operator_requests
      WHERE email = ?
      `,

      [email]

    );

    if (
      existingRequest.length > 0
    ) {

      return res
      .status(400)
      .json({

        message:
        "Request already submitted"

      });

    }

    // CHECK USERS TABLE

    const [existingUser] =
    await db.query(

      `
      SELECT *
      FROM users
      WHERE email = ?
      `,

      [email]

    );

    if (
      existingUser.length > 0
    ) {

      return res
      .status(400)
      .json({

        message:
        "Email already exists"

      });

    }

    // HASH PASSWORD

    const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

    // INSERT REQUEST

    await db.query(

      `
      INSERT INTO
      operator_requests

      (
        full_name,
        email,
        phone,
        password
      )

      VALUES (?, ?, ?, ?)
      `,

      [
        full_name,
        email,
        phone,
        hashedPassword
      ]

    );

    res.status(201).json({

      message:
      "Operator request submitted successfully"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};




// GET ALL REQUESTS

exports.getAllOperatorRequests =
async (req, res) => {

  try {

    const [requests] =
    await db.query(

      `
      SELECT *
      FROM operator_requests
      ORDER BY created_at DESC
      `

    );

    res.status(200).json(
      requests
    );

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};




// APPROVE REQUEST

exports.approveOperatorRequest =
async (req, res) => {

  try {

    const { id } = req.params;

    // GET REQUEST

    const [requestData] =
    await db.query(

      `
      SELECT *
      FROM operator_requests
      WHERE id = ?
      `,

      [id]

    );

    if (
      requestData.length === 0
    ) {

      return res
      .status(404)
      .json({

        message:
        "Request not found"

      });

    }

    const request =
    requestData[0];

    // CREATE USER

    await db.query(

      `
      INSERT INTO users

      (
        full_name,
        email,
        phone,
        password,
        role
      )

      VALUES (?, ?, ?, ?, ?)
      `,

      [

        request.full_name,

        request.email,

        request.phone,

        request.password,

        "operator"

      ]

    );

    // UPDATE STATUS

    await db.query(

      `
      UPDATE operator_requests
      SET status = 'approved'
      WHERE id = ?
      `,

      [id]

    );

    res.status(200).json({

      message:
      "Operator approved successfully"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};




// REJECT REQUEST

exports.rejectOperatorRequest =
async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(

      `
      UPDATE operator_requests
      SET status = 'rejected'
      WHERE id = ?
      `,

      [id]

    );

    res.status(200).json({

      message:
      "Operator request rejected"

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "Server Error"

    });

  }

};