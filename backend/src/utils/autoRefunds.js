const db =
require("../config/db");

const autoRefunds =
async () => {

  try {

    // REFUND AFTER 5 MINUTES

    await db.query(
      `UPDATE cancelled_bookings
       SET refund_status = 'Refunded'
       WHERE refund_status = 'Pending'
       AND cancelled_at <=
       NOW() - INTERVAL 5 MINUTE`
    );

    console.log(
      "Auto refund check completed..."
    );

  } catch (error) {

    console.log(error);

  }

};

module.exports =
autoRefunds;