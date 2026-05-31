const cron = require("node-cron");

const expireReservations =
require("./expireReservations");

// RUN EVERY 1 MINUTE

cron.schedule("* * * * *", async () => {

  console.log(
    "Running reservation expiry cleanup..."
  );

  try {

    await expireReservations();

  } catch (error) {

    console.log(
      "Cron cleanup error:",
      error
    );

  }

});