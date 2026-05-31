const db = require("../config/db");

const getAllBusesAdmin = async (req, res) => {
  try {

    const [buses] = await db.query(`
      SELECT *
      FROM buses
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      buses
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch buses"
    });

  }
};

// ======================================
// GET ALL USERS
// ======================================

const getAllUsers = async (req, res) => {
  try {

    const [users] = await db.query(`
      SELECT
      id,
      full_name,
      email,
      phone,
      role,
      created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });

  }
};

// ======================================
// DELETE USER
// ======================================

const deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM users WHERE id=?",
      [id]
    );

    res.json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });

  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllBusesAdmin
};