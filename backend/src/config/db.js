const mysql =
require("mysql2/promise");

require("dotenv").config();

// CREATE CONNECTION POOL

const db =
mysql.createPool({

  host:
  process.env.DB_HOST,

  user:
  process.env.DB_USER,

  password:
  process.env.DB_PASSWORD,

  database:
  process.env.DB_NAME,

  port:
  process.env.DB_PORT,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0

});

// TEST DATABASE CONNECTION

async function connectDB() {

  try {

    const connection =
    await db.getConnection();

    console.log(
      "✅ MySQL Connected Successfully"
    );

    connection.release();

  }

  catch (error) {

    console.error(

      "❌ Database Connection Failed:",

      error

    );

  }

}

// INITIAL CONNECTION TEST

connectDB();

// EXPORT DATABASE

module.exports = db;