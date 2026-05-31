import { useEffect, useState } from "react";
import axios from "../../api/axios";

function Bookings() {

  const [trips, setTrips] = useState([]);

  const [selectedTrip, setSelectedTrip] =
    useState("");

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchTrips = async () => {
  try {

    console.log("TOKEN:", localStorage.getItem("token"));


    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const response = await axios.get(
      "/trips/admin/all",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(response.data);
    
    setTrips(response.data.trips || []);
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

  const fetchBookings =
    async (tripId) => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(

            `/bookings/trip/${tripId}`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }

          );

        setBookings(
          response.data.bookings || []
        );

      }

      catch (error) {

        console.log(error);

      }

      finally {

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

        fetchBookings(
          tripId
        );

      }

    };

  return (

    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold text-red-500 mb-8">

        Bookings

      </h1>

      {/* TRIP DROPDOWN */}

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

      {/* BOOKINGS */}

      {

        !selectedTrip

        ?

        (

          <div className="bg-zinc-900 rounded-xl p-6">

            Select a trip to view bookings

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

        bookings.length === 0

        ?

        (

          <div className="bg-zinc-900 rounded-xl p-6">

            No bookings found

          </div>

        )

        :

        bookings.map(
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

              <div className="flex justify-between mb-4">

                <h2 className="text-xl font-bold text-red-500">

                  {booking.booking_code}

                </h2>

                <span className="bg-green-600 px-3 py-1 rounded-full text-sm">

                  {booking.booking_status}

                </span>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

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

                    Gender

                  </p>

                  <p>

                    {booking.passenger_gender}

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Age

                  </p>

                  <p>

                    {booking.passenger_age}

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

                    Fare

                  </p>

                  <p className="text-green-400">

                    ₹{booking.fare}

                  </p>

                </div>

                <div>

                  <p className="text-zinc-500 text-sm">

                    Booked At

                  </p>

                  <p>

                    {
                      booking.booked_at
                      ?
                      new Date(
                        booking.booked_at
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

export default Bookings;