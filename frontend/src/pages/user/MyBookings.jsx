import { useEffect, useState } from "react";
import axios from "../../api/axios";

import jsPDF from "jspdf";
import QRCode from "qrcode";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


const downloadTicket = async (booking) => {
  const doc = new jsPDF();

  // Background
  doc.setFillColor(15, 15, 25);
  doc.rect(0, 0, 210, 297, "F");

  // Header
  doc.setFillColor(255, 45, 65);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SMART BUS", 15, 18);

  doc.setFontSize(10);
  doc.text("Premium Online Bus Booking", 15, 25);

  // Status Badge
  const statusColor =
    booking.booking_status === "Cancelled"
      ? [255, 0, 0]
      : [0, 180, 0];

  doc.setFillColor(...statusColor);
  doc.roundedRect(150, 10, 40, 12, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(
    booking.booking_status || "Booked",
    158,
    18
  );

  // Watermark
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(55);
  doc.text("SMART BUS", 35, 180, {
    angle: 45,
  });

  // Main Content
  doc.setTextColor(255, 255, 255);

  doc.setFontSize(18);
  doc.text("E-TICKET", 15, 45);

  doc.setDrawColor(255, 45, 65);
  doc.line(15, 50, 195, 50);

  // Booking Details
  doc.setFontSize(12);

  doc.text(
    `Booking Code: ${booking.booking_code}`,
    15,
    65
  );

  doc.text(
    `Passenger: ${booking.passenger_name}`,
    15,
    80
  );

  doc.text(
    `Seat Number: ${booking.seat_number}`,
    15,
    95
  );

  doc.text(
    `Bus: ${booking.bus_name}`,
    15,
    110
  );

  doc.text(
    `Route: ${booking.source_city} TO ${booking.destination_city}`,
    15,
    125
  );

  doc.text(
    `Departure: ${
      booking.departure_datetime
        ? new Date(
            booking.departure_datetime
          ).toLocaleString()
        : "N/A"
    }`,
    15,
    140
  );

  doc.text(
    `Fare: Rs. ${Number(booking.fare).toFixed(2)}`,
    15,
    155
  );

  // QR Code
  const qrData = JSON.stringify({
    bookingCode: booking.booking_code,
    passenger: booking.passenger_name,
    seat: booking.seat_number,
  });

  const qrImage = await QRCode.toDataURL(
    qrData
  );

  doc.addImage(
    qrImage,
    "PNG",
    145,
    90,
    45,
    45
  );

  doc.setFontSize(9);
  doc.text(
    "Scan to Verify",
    152,
    142
  );

  // Footer
  doc.setDrawColor(255, 45, 65);
  doc.line(15, 250, 195, 250);

  doc.setFontSize(10);
  doc.text(
    "Thank you for choosing Smart Bus",
    15,
    265
  );

  doc.text(
    "Safe Journey!",
    15,
    275
  );

  doc.save(
    `${booking.booking_code}.pdf`
  );
};

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      await fetchBookings();
    };

    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const confirmCancel = window.confirm(
        "Cancel this ticket?"
      );

      if (!confirmCancel) {
        return;
      }

      const token = localStorage.getItem("token");

      await axios.put(
        `/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Ticket cancelled successfully");

      fetchBookings();
    } catch (error) {
      console.log(error);
      alert("Failed to cancel ticket");
    }
  };

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
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl">
            No bookings found
          </h3>
        </div>
      ) : (
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
              hover:border-red-500
              transition-all
            "
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-red-500">
                  {booking.booking_code}
                </h2>

                <p className="text-gray-400">
                  {booking.source_city}
                  {" → "}
                  {booking.destination_city}
                </p>
              </div>

              <span
                className="
                  bg-green-600
                  text-white
                  px-3
                  py-1
                  rounded-full
                  text-sm
                "
              >
                {booking.booking_status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-sm">
                  Bus
                </p>

                <p className="font-semibold">
                  {booking.bus_name}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Seat
                </p>

                <p className="font-semibold">
                  {booking.seat_number}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Passenger Name
                </p>

                <p className="font-semibold">
                  {booking.passenger_name}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Fare
                </p>

                <p className="text-green-400 font-semibold">
                  ₹{booking.fare}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Departure
                </p>

                <p className="font-semibold">
                  {booking.departure_datetime
                    ? new Date(
                        booking.departure_datetime
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
  onClick={() =>
    downloadTicket(booking)
  }
  className="
    bg-blue-600
    hover:bg-blue-700
    px-5
    py-2
    rounded-lg
  "
>
  Download Ticket
</button>

              {booking.booking_status ===
                "Booked" && (
                <button
                  onClick={() =>
                    handleCancel(booking.id)
                  }
                  className="
                    bg-red-600
                    hover:bg-red-700
                    px-4
                    py-2
                    rounded-lg
                    text-white
                    transition
                  "
                >
                  Cancel Ticket
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;