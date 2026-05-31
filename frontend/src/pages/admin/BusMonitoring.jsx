import { useEffect, useState } from "react";
import axios from "axios";

function BusMonitoring() {
  const [buses, setBuses] = useState([]);

  const loadBuses = async () => {
    try {
      const token = localStorage.getItem("token");

const response = await axios.get(
    "http://localhost:5000/api/admin/buses",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response.data);

  setBuses(
    Array.isArray(response.data.buses)
      ? response.data.buses
      : []
  );
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    await loadBuses();
  };

  fetchData();
}, []);

  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold text-red-500 mb-10">
        Bus Monitoring
      </h1>

      <div className="space-y-6">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-3xl font-bold text-red-500">
                  {bus.bus_name}
                </h2>

                <p className="text-zinc-400 mt-1">
                  {bus.bus_number}
                </p>
              </div>

              <span className="bg-blue-500 text-blue-100 px-4 py-2 rounded-full text-sm">
                Bus
              </span>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-zinc-500 text-sm">Type</p>
                <p className="text-white">{bus.bus_type}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Brand</p>
                <p className="text-white">{bus.bus_body_type}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Seats</p>
                <p className="text-green-600 font-bold">
                  {bus.total_seats}
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Bus ID</p>
                <p className="text-white">{bus.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusMonitoring;