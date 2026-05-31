import { motion } from "framer-motion";

function AvailableTrips({

  trips = [],
  loading = false,
  onViewSeats,
  onViewBus

}) {


  /*
  ============================================
  SAFE ARRAY
  ============================================
  */

  const safeTrips =
    Array.isArray(trips)
      ? trips
      : [];

  /*
  ============================================
  FORMAT DATE
  ============================================
  */

 const formatDateTime = (date) => {

  if (!date) return "N/A";

  return new Date(date)

    .toLocaleString(

      "en-GB",

      {

        day: "2-digit",
        month: "2-digit",
        year: "numeric",

        hour: "numeric",
        minute: "2-digit",

        hour12: true

      }

    )

    .replace("am", "AM")

    .replace("pm", "PM");

};

  /*
  ============================================
  LOADING
  ============================================
  */

  if (loading) {

    return (

      <div className="text-center text-zinc-400 py-20">

        Loading trips...

      </div>

    );

  }

  /*
  ============================================
  EMPTY
  ============================================
  */

  if (safeTrips.length === 0) {

    return (

      <div className="

        bg-zinc-950
        border
        border-zinc-800

        rounded-3xl

        p-10

        text-center
        text-zinc-500

      ">

        No trips found

      </div>

    );

  }

  return (

    <div className="space-y-5">

      {

        safeTrips.map((trip) => (

          <motion.div

            key={trip.id}

            whileHover={{

              scale: 1.01

            }}

            className="

              bg-zinc-950

              border
              border-zinc-800

              rounded-3xl

              p-6

              flex
              flex-col

              lg:flex-row
              lg:items-center
              lg:justify-between

              gap-6

              hover:border-red-500

              transition-all
              duration-300

            "

          >

            {/* LEFT */}

            <div>

              {/* BUS NAME */}

              <h2 className="

                text-2xl
                font-bold
                text-white

              ">

                {

                  trip.bus_name ||
                  "Unknown Bus"

                }

              </h2>

              {/* OPERATOR */}

              <p className="

                text-zinc-400
                mt-1

              ">

                {

                  trip.operator_name ||
                  "Unknown Operator"

                }

              </p>

              {/* TAGS */}

              <div className="

                flex
                gap-3

                mt-4

                flex-wrap

              ">

                {/* BUS TYPE */}

                <span className="

                  bg-zinc-900

                  border
                  border-zinc-700

                  px-3
                  py-1

                  rounded-xl

                  text-sm

                ">

                  {

                    trip.bus_type ||
                    "N/A"

                  }

                </span>

                {/* BODY TYPE */}

                <span className="

                  bg-zinc-900

                  border
                  border-zinc-700

                  px-3
                  py-1

                  rounded-xl

                  text-sm

                ">

                  {

                    trip.bus_body_type ||
                    "N/A"

                  }

                </span>

                {/* AVAILABLE */}

                <span className="

                  bg-green-900

                  text-green-300

                  px-3
                  py-1

                  rounded-xl

                  text-sm

                  border
                  border-green-700

                ">

                  {

                    trip.available_seats || 0

                  } Seats Available

                </span>

              </div>

              {/* FARE */}

              <div className="mt-4">

                <p className="

                  text-sm
                  text-zinc-500

                ">

                  Ticket Fare

                </p>

                <h2 className="

                  text-2xl
                  font-bold

                  text-red-400

                ">

                  ₹{trip.fare || 0}

                </h2>

              </div>

            </div>

            {/* CENTER */}

            <div className="

              flex
              items-center

              gap-8

            ">

              {/* FROM */}

              <div>

                <p className="

                  text-sm
                  text-zinc-500

                ">

                  FROM

                </p>

                <h3 className="

                  text-lg
                  font-semibold

                ">

                  {

                    trip.source_city ||
                    "N/A"

                  }

                </h3>

              </div>

              {/* ARROW */}

              <div className="

                text-zinc-500
                text-xl

              ">

                →

              </div>

              {/* TO */}

              <div>

                <p className="

                  text-sm
                  text-zinc-500

                ">

                  TO

                </p>

                <h3 className="

                  text-lg
                  font-semibold

                ">

                  {

                    trip.destination_city ||
                    "N/A"

                  }

                </h3>

              </div>

            </div>

            {/* RIGHT */}

            <div className="

              flex
              flex-col

              items-end

              gap-4

            ">

              {/* DEPARTURE */}

              <div className="text-right">

                <p className="

                  text-sm
                  text-zinc-500

                ">

                  Departure

                </p>

                <h3 className="font-semibold">

                  {

                    formatDateTime(
                      trip.departure_datetime
                    )

                  }

                </h3>

              </div>

              {/* ARRIVAL */}

              <div className="text-right">

                <p className="

                  text-sm
                  text-zinc-500

                ">

                  Arrival

                </p>

                <h3 className="font-semibold">

                  {

                    formatDateTime(
                      trip.arrival_datetime
                    )

                  }

                </h3>

              </div>

              {/* BUTTON */}

              <div className="flex gap-3">

  <button

    onClick={() =>

      onViewBus &&
      onViewBus(trip.bus_id)

    }

    className="
      bg-zinc-800
      hover:bg-zinc-700
      px-6
      py-3
      rounded-2xl
      font-semibold
      transition-all
      duration-300
    "

  >

    View Bus

  </button>

  <button

    onClick={() =>

      onViewSeats &&
      onViewSeats(trip.id)

    }

    className="
      bg-red-500
      hover:bg-red-600
      px-6
      py-3
      rounded-2xl
      font-semibold
      transition-all
      duration-300
    "

  >

    View Seats

  </button>

</div>

            </div>

          </motion.div>

        ))

      }

    </div>

  );

}

export default AvailableTrips;