const jwt =
require("jsonwebtoken");

const verifyToken =
(req, res, next) => {

  try {

    /*
    ========================================
    GET AUTH HEADER
    ========================================
    */

    const authHeader =
    req.headers.authorization;

    /*
    ========================================
    CHECK HEADER
    ========================================
    */

    if (!authHeader) {

      return res.status(401)
      .json({

        success: false,

        message:
        "Authorization header missing"

      });

    }

    /*
    ========================================
    EXTRACT TOKEN
    ========================================
    */

    const token =
    authHeader.split(" ")[1];

    /*
    ========================================
    CHECK TOKEN
    ========================================
    */

    if (!token) {

      return res.status(401)
      .json({

        success: false,

        message:
        "Token missing"

      });

    }

    /*
    ========================================
    VERIFY TOKEN
    ========================================
    */

    const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    /*
    ========================================
    ATTACH USER
    ========================================
    */

    req.user = decoded;

    /*
    ========================================
    NEXT
    ========================================
    */

    next();

  }

  catch (error) {

    console.log(error);

    return res.status(401)
    .json({

      success: false,

      message:
      "Invalid or expired token"

    });

  }

};

module.exports =
verifyToken;