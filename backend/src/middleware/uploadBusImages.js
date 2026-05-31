const multer =
require("multer");

const path =
require("path");

const storage =
multer.diskStorage({

  destination:
  (req, file, cb) => {

    cb(
      null,
      "uploads/buses"
    );

  },

  filename:
  (req, file, cb) => {

    cb(

      null,

      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1e9
      ) +
      path.extname(
        file.originalname
      )

    );

  }

});

const fileFilter =
(
  req,
  file,
  cb
) => {

  const allowedTypes =

    /jpeg|jpg|png|webp/;

  const isValid =

    allowedTypes.test(
      path.extname(
        file.originalname
      ).toLowerCase()
    );

  if (isValid) {

    cb(
      null,
      true
    );

  }

  else {

    cb(
      new Error(
        "Only image files are allowed"
      )
    );

  }

};

module.exports =
multer({

  storage,

  fileFilter,

  limits: {

    fileSize:
      5 * 1024 * 1024

  }

});