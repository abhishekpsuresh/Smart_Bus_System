import { useEffect, useState } from "react";
import axios from "../../api/axios";

function MyCancelledBookings() {

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchCancelledBookings =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(
            "/bookings/my-cancelled-bookings",
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

  useEffect(() => {

  const loadData = async () => {

    await fetchCancelledBookings();

  };

  loadData();

}, []);

  if (loading) {

    return (
      <div className="text-white p-6">
        Loading...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-black p-6 text-white">

      <h1 className="text-4xl font-bold text-red-500 mb-8">
        Cancelled Bookings
      </h1>

      {

        bookings.length === 0

        ?

        (

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <h3 className="text-xl">
              No cancelled bookings found
            </h3>

          </div>

        )

        :

        bookings.map((booking) => (

          <div

            key={booking.id}

            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-6
              mb-6
              shadow-lg
            "

          >

            <div className="flex justify-between items-start mb-6">

  <div>
    <h2 className="text-2xl font-bold text-red-500">
      {booking.booking_code}
    </h2>

    <p className="text-gray-400 mt-1">
      Seat: {booking.seat_number}
    </p>
  </div>

  <span
    className="
      bg-red-500/20
      text-red-400
      border
      border-red-500/30
      px-4
      py-1
      rounded-full
      text-sm
      font-medium
    "
  >
    ✕ Cancelled
  </span>

</div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              <div>

                <p className="text-gray-500 text-sm">
                  Passenger
                </p>

                <p>
                  {booking.passenger_name}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Original Fare
                </p>

                <p>
                  ₹{booking.fare}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Refund Percentage
                </p>

                <p>
                  {booking.refund_percentage}%
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Refund Amount
                </p>

                <p className="text-green-400">
                  ₹{booking.refund_amount}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Refund Status
                </p>

                <p>
                  {booking.refund_status}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
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

        ))

      }

    </div>

  );

}

export default MyCancelledBookings;