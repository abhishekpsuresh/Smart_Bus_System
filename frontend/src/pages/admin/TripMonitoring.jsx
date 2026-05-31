import { useEffect, useState } from "react";
import axios from "axios";

function TripMonitoring() {
  const [trips, setTrips] = useState([]);

  const loadTrips = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/trips/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrips(
        Array.isArray(response.data)
          ? response.data
          : response.data.trips || []
      );
    } catch (error) {
      console.log(error);
    }
  };

 useEffect(() => {
  const fetchData = async () => {
    await loadTrips();
  };

  fetchData();
}, []);

  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold text-red-500 mb-10">
        Trip Monitoring
      </h1>

      <div className="space-y-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-3xl font-bold text-red-500">
                  {trip.trip_code || trip.trip_number}
                </h2>

                <p className="text-zinc-400 mt-1">
                  {trip.bus_name || "Unknown Bus"}
                </p>
              </div>

              <span className="bg-green-500 text-green-100 px-4 py-2 rounded-full text-sm">
                Active
              </span>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-zinc-500 text-sm">From</p>
                <p className="text-white text-lg">{trip.source_city}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">To</p>
                <p className="text-white text-lg">{trip.destination_city}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Fare</p>
                <p className="text-green-400 font-bold text-lg">
                  ₹{trip.fare}
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Trip ID</p>
                <p className="text-white">{trip.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripMonitoring;