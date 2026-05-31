const db =
require("../config/db");

const bcrypt =
require("bcryptjs");

const jwt =
require("jsonwebtoken");

// ======================================================
// REGISTER
// ======================================================

const register =
async (req, res) => {

  try {

    const {

      full_name,
      email,
      password,
      phone,
      role

    } = req.body;

    const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

if (!passwordRegex.test(password)) {

  return res.status(400).json({

    success: false,

    message:
      "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long"

  });

}

    // CHECK EXISTING USER

    const [existingUsers] =
    await db.query(

      `

        SELECT *

        FROM users

        WHERE email = ?

      `,

      [email]

    );

    // USER EXISTS

    if (existingUsers.length > 0) {

      return res.status(400).json({

        success: false,

        message:
        "User already exists"

      });

    }

    // HASH PASSWORD

    const hashedPassword =
    await bcrypt.hash(

      password,

      10

    );

    // INSERT USER

    await db.query(

      `

        INSERT INTO users (

          full_name,
          email,
          password,
          phone,
          role

        )

        VALUES (?, ?, ?, ?, ?)

      `,

      [

        full_name,
        email,
        hashedPassword,
        phone,
        role

      ]

    );

    // SUCCESS

    return res.status(201).json({

      success: true,

      message:
      "Registration successful"

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

// ======================================================
// LOGIN
// ======================================================

const login =
async (req, res) => {

  try {

    const {
  email,
  password,
  role
} = req.body;


    // CHECK USER

    const [users] =
    await db.query(

      `

        SELECT *

        FROM users

        WHERE email = ?

      `,

      [email]

    );

    // USER NOT FOUND

    if (users.length === 0) {

      return res.status(404).json({

        success: false,

        message:
        "User not found"

      });

    }

    const user =
    users[0];

    // CHECK PASSWORD

    const isMatch =
    await bcrypt.compare(

      password,

      user.password

    );

    // INVALID PASSWORD

    if (!isMatch) {

      return res.status(401).json({

        success: false,

        message:
        "Invalid password"

      });

    }

    if (role && user.role !== role) {

  return res.status(403).json({

    success: false,

    message: "Invalid credentials"

  });

}

    // CREATE TOKEN

    const token =
    jwt.sign(

      {

        id: user.id,

        name:
        user.full_name,

        email:
        user.email,

        role:
        user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d"

      }

    );

    // SUCCESS

    return res.status(200).json({

      success: true,

      message:
      "Login successful",

      token,

      user: {

        id: user.id,

        full_name:
        user.full_name,

        email:
        user.email,

        role:
        user.role

      }

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

// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  register,

  login

};