import { useEffect, useState } from "react";
import axios from "../../api/axios";

function CancelledBookings() {

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "/trips/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      setTrips(
        response.data.trips || []
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
  const loadTrips = async () => {
    await fetchTrips();
  };

  loadTrips();
}, []);

  const fetchCancelledBookings =
    async (tripId) => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(
            `/bookings/cancelled/trip/${tripId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

        setCancelledBookings(
          response.data.bookings || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const handleTripChange =
    (e) => {

      const tripId =
        e.target.value;

      setSelectedTrip(
        tripId
      );

      if (tripId) {

        fetchCancelledBookings(
          tripId
        );

      }

    };

  return (

    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold text-red-500 mb-8">

        Cancelled Bookings

      </h1>

      <div className="mb-8">

        <select

          value={selectedTrip}

          onChange={handleTripChange}

          className="
            bg-zinc-900
            border
            border-zinc-700
            rounded-xl
            px-4
            py-3
            w-full
            md:w-[450px]
          "

        >

          <option value="">

            Select Trip

          </option>

          {

            trips.map(
              (trip) => (

                <option
                  key={trip.id}
                  value={trip.id}
                >

                  {trip.trip_code}
                  {" | "}
                  {trip.source_city}
                  {" → "}
                  {trip.destination_city}

                </option>

              )
            )

          }

        </select>

      </div>

      {

        !selectedTrip

        ?

        (

          <div className="bg-zinc-900 rounded-xl p-6">

            Select a trip to view cancelled bookings

          </div>

        )

        :

        loading

        ?

        (

          <div className="bg-zinc-900 rounded-xl p-6">

            Loading...

          </div>

        )

        :

        cancelledBookings.length === 0

        ?

        (

          <div className="bg-zinc-900 rounded-xl p-6">

            No cancelled bookings found

          </div>

        )

        :

        cancelledBookings.map(
          (booking) => (

            <div

              key={booking.id}

              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-6
                mb-6
              "

            >

              <div className="flex justify-between mb-5">

                <h2 className="text-xl font-bold text-red-500">

                  {booking.booking_code}

                </h2>

                <span className="bg-red-600 px-3 py-1 rounded-full text-sm">

                  Cancelled

                </span>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                <div>

                  <p className="text-zinc-500 text-sm">

                    Passenger

                  </p>

                  <p>

                    {booking.passenger_name}

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Seat

                  </p>

                  <p>

                    {booking.seat_number}

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Original Fare

                  </p>

                  <p className="text-green-400">

                    ₹{booking.original_fare}

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Refund Amount

                  </p>

                  <p className="text-green-400">

                    ₹{booking.refund_amount}

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Refund %

                  </p>

                  <p>

                    {booking.refund_percentage}%

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Refund Status

                  </p>

                  <p>

                    {booking.refund_status}

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Cancelled At

                  </p>

                  <p>

                    {

                      booking.cancelled_at

                      ?

                      new Date(
                        booking.cancelled_at
                      ).toLocaleString()

                      :

                      "N/A"

                    }

                  </p>

                </div>

              </div>

            </div>

          )
        )

      }

    </div>

  );

}

export default CancelledBookings;