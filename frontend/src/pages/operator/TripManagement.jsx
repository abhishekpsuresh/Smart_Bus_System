import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import {
  Plus,
  Trash2,
  Pencil
} from "lucide-react";

import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import Notification from "../../components/Notification";
import CustomDropdown from "../../components/CustomDropdown";

function TripManagement() {

  // ===================================================
  // USER
  // ===================================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // ===================================================
  // TOKEN
  // ===================================================

  const token =
    localStorage.getItem("token");

  // ===================================================
  // STATES
  // ===================================================

  const [
    trips,
    setTrips
  ] = useState([]);

  const [
    buses,
    setBuses
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    showTripModal,
    setShowTripModal
  ] = useState(false);

  const [
    editingTripId,
    setEditingTripId
  ] = useState(null);

  const [
    submitLoading,
    setSubmitLoading
  ] = useState(false);

  // ===================================================
  // NOTIFICATION
  // ===================================================

  const [

    notification,
    setNotification

  ] = useState({

    show: false,

    type: "success",

    message: ""

  });

  // ===================================================
  // FORM DATA
  // ===================================================

  const [
    tripData,
    setTripData
  ] = useState({

    bus_id: "",

    source_city: "",

    destination_city: "",

    departure_datetime: "",

    arrival_datetime: "",

    trip_status: "Scheduled",

    fare: ""
    

  });

  // ===================================================
  // SHOW NOTIFICATION
  // ===================================================

  const showNotification =
    (type, message) => {

      setNotification({

        show: true,

        type,

        message

      });

      setTimeout(() => {

        setNotification({

          show: false,

          type: "",

          message: ""

        });

      }, 2500);

    };

  // ===================================================
  // FETCH TRIPS
  // ===================================================

  const fetchTrips =
    useCallback(

      async () => {

        try {

          setLoading(true);

          const response =
            await axios.get(

              `http://localhost:5000/api/trips/${user?.id}`,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`

                }

              }

            );

          const tripsData =

            Array.isArray(response.data)

            ? response.data

            : response.data?.trips || [];

          setTrips(tripsData);

        }

        catch (error) {

          console.log(error);

          setTrips([]);

          showNotification(

            "error",

            "Failed to load trips"

          );

        }

        finally {

          setLoading(false);

        }

      },

      [

        user?.id,
        token

      ]

    );

  // ===================================================
  // FETCH BUSES
  // ===================================================

  const fetchBuses =
    useCallback(

      async () => {

        try {

          const response =
            await axios.get(

              "http://localhost:5000/api/buses",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`

                }

              }

            );

          const busesData =

            Array.isArray(
              response.data?.buses
            )

            ? response.data.buses

            : [];

          setBuses(busesData);

        }

        catch (error) {

          console.log(error);

          setBuses([]);

          showNotification(

            "error",

            "Failed to load buses"

          );

        }

      },

      [token]

    );

  // ===================================================
  // LOAD DATA
  // ===================================================

  useEffect(() => {

    if (!user?.id)
      return;

    const loadData =
      async () => {

        await fetchTrips();

        await fetchBuses();

      };

    loadData();

  }, [

    fetchTrips,
    fetchBuses,
    user?.id

  ]);

  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm =
    () => {

      setTripData({

        bus_id: "",

        source_city: "",

        destination_city: "",

        departure_datetime: "",

        arrival_datetime: "",

       trip_status: "Scheduled",

      fare: ""

      });

      setEditingTripId(null);

    };

  // ===================================================
  // OPEN MODAL
  // ===================================================

  const openAddModal =
    () => {

      resetForm();

      setShowTripModal(true);

    };

  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const closeModal =
    () => {

      setShowTripModal(false);

      resetForm();

    };

  // ===================================================
  // ADD / UPDATE TRIP
  // ===================================================

  const handleTripSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setSubmitLoading(true);

        let response;

        // =========================================
        // UPDATE
        // =========================================

        if (editingTripId) {

          response =
            await axios.put(

              `http://localhost:5000/api/trips/${editingTripId}`,

              {

                ...tripData,

                operator_id:
                  user.id

              },

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`

                }

              }

            );

        }

        // =========================================
        // ADD
        // =========================================

        else {

          response =
            await axios.post(

              "http://localhost:5000/api/trips",

              {

                ...tripData,

                operator_id:
                  user.id

              },

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`

                }

              }

            );

        }

        showNotification(

          "success",

          response.data.message

        );

        closeModal();

        fetchTrips();

      }

      catch (error) {

        console.log(error);

        showNotification(

          "error",

          error.response?.data
            ?.message ||

          "Operation failed"

        );

      }

      finally {

        setSubmitLoading(false);

      }

    };

  // ===================================================
  // DELETE TRIP
  // ===================================================

  const handleDeleteTrip =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this trip?"
        );

      if (!confirmDelete)
        return;

      try {

        const response =
          await axios.delete(

            `http://localhost:5000/api/trips/${id}`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        showNotification(

          "success",

          response.data.message

        );

        fetchTrips();

      }

      catch (error) {

        console.log(error);

        showNotification(

          "error",

          "Delete failed"

        );

      }

    };

  // ===================================================
  // EDIT TRIP
  // ===================================================

  const handleEditTrip =
    (trip = {}) => {

      setEditingTripId(
        trip.id
      );

      setTripData({

        bus_id:
          trip.bus_id || "",

        source_city:
          trip.source_city || "",

        destination_city:
          trip.destination_city || "",

        departure_datetime:
          trip.departure_datetime
            ?.slice(0, 16) || "",

        arrival_datetime:
          trip.arrival_datetime
            ?.slice(0, 16) || "",

        trip_status:
          trip.trip_status || "Scheduled",

        fare:
          trip.fare || ""

      });

      setShowTripModal(true);

    };

  // ===================================================
  // TABLE COLUMNS
  // ===================================================

  const columns = [

    "Trip Code",

    "Bus",

    "Source",

    "Destination",

    "Departure",

    "Arrival",

    "Fare",

    "Status",

    "Added At",

    "Updated At",

    "Actions"

  ];

  return (

    <div className="w-full">

      {/* NOTIFICATION */}

      <Notification

        show={notification.show}

        type={notification.type}

        message={notification.message}

        onClose={() =>

          setNotification({

            ...notification,

            show: false

          })

        }

      />

      {/* CONTENT */}

      <div className="px-8 py-10">

        {/* HEADER */}

        <div className="

          flex
          justify-between
          items-start

          mb-10

        ">

          <div>

            <h1 className="

              text-5xl
              font-bold

              text-white

            ">

              Trip Management

            </h1>

            <p className="

              text-zinc-400

              mt-3
              text-lg

            ">

              Manage operator trips

            </p>

          </div>

          {/* BUTTON */}

          <button

            onClick={openAddModal}

            className="

              bg-red-500
              hover:bg-red-600

              transition-all
              duration-300

              px-8 py-5

              rounded-3xl

              flex
              items-center
              gap-3

              font-semibold
              text-lg

            "

          >

            <Plus size={22} />

            Add Trip

          </button>

        </div>

        {/* TABLE */}

        <DataTable

          columns={columns}

          data={

            Array.isArray(trips)

            ? trips

            : []

          }

          loading={loading}

          emptyMessage="No trips added yet"

          renderRow={(trip = {}) => (

            <tr

              key={trip.id}

              className="

                border-b
                border-zinc-800

                hover:bg-zinc-800/40

                transition-all
                duration-300

              "

            >

              {/* TRIP CODE */}

              <td className="

                p-6

                font-bold
                text-red-400

              ">

                {trip.trip_code || "-"}

              </td>

              {/* BUS */}

              <td className="p-6">

                {

                  trip.bus_name || "-"

                }

                {" - "}

                {

                  trip.bus_number || "-"

                }

              </td>

              {/* SOURCE */}

              <td className="p-6">

                {trip.source_city || "-"}

              </td>

              {/* DESTINATION */}

              <td className="p-6">

                {trip.destination_city || "-"}

              </td>

              {/* DEPARTURE */}

              <td className="p-6">

                {

                  trip.departure_datetime

                  ?

                  new Date(
                    trip.departure_datetime
                  ).toLocaleString()

                  :

                  "-"

                }

              </td>

              {/* ARRIVAL */}

              <td className="p-6">

                {

                  trip.arrival_datetime

                  ?

                  new Date(
                    trip.arrival_datetime
                  ).toLocaleString()

                  :

                  "-"

                }

              </td>

              {/* FARE */}

              <td className="p-6">

                ₹{trip.fare || 0}

              </td>

              {/* STATUS */}

              <td className="p-6">

                <span className="

                  bg-red-500/20

                  text-red-400

                  px-4 py-2

                  rounded-xl

                  text-sm

                ">

                  {

                    trip.trip_status ||
                    "Scheduled"

                  }

                </span>

              </td>

              {/* CREATED */}

              <td className="

                p-6

                text-sm
                text-zinc-400

              ">

                {

                  trip.created_at

                  ?

                  new Date(
                    trip.created_at
                  ).toLocaleString()

                  :

                  "-"

                }

              </td>

              {/* UPDATED */}

              <td className="

                p-6

                text-sm
                text-zinc-400

              ">

                {

                  trip.updated_at

                  ?

                  new Date(
                    trip.updated_at
                  ).toLocaleString()

                  :

                  "-"

                }

              </td>

              {/* ACTIONS */}

              <td className="p-6">

                <div className="

                  flex
                  justify-center
                  gap-3

                ">

                  {/* EDIT */}

                  <button

                    onClick={() =>
                      handleEditTrip(trip)
                    }

                    className="

                      bg-blue-500
                      hover:bg-blue-600

                      p-3

                      rounded-2xl

                      transition-all
                      duration-300

                    "

                  >

                    <Pencil size={18} />

                  </button>

                  {/* DELETE */}

                  <button

                    onClick={() =>
                      handleDeleteTrip(
                        trip.id
                      )
                    }

                    className="

                      bg-red-500
                      hover:bg-red-600

                      p-3

                      rounded-2xl

                      transition-all
                      duration-300

                    "

                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </td>

            </tr>

          )}

        />

      </div>

      {/* MODAL */}

      <Modal

        isOpen={showTripModal}

        onClose={closeModal}

        title={

          editingTripId

            ? "Edit Trip"

            : "Add Trip"

        }

        maxWidth="max-w-2xl"

      >

        {/* FORM */}

        <form

          onSubmit={handleTripSubmit}

          className="space-y-5"

        >

          {/* BUS SELECT */}

          <CustomDropdown

            options={

              buses.map((bus) => (

                `${bus.bus_name} - ${bus.bus_number}`

              ))

            }

            value={

              buses.find(

                (bus) =>

                  String(bus.id) ===
                  String(tripData.bus_id)

              )

              ?

              `${
                buses.find(

                  (bus) =>

                    String(bus.id) ===
                    String(tripData.bus_id)

                )?.bus_name

              } - ${
                buses.find(

                  (bus) =>

                    String(bus.id) ===
                    String(tripData.bus_id)

                )?.bus_number

              }`

              :

              ""

            }

            onChange={(selectedBus) => {

              const matchedBus =
                buses.find(

                  (bus) =>

                    `${bus.bus_name} - ${bus.bus_number}`

                    ===

                    selectedBus

                );

              setTripData({

                ...tripData,

                bus_id:
                  matchedBus?.id || ""

              });

            }}

            placeholder="Select Bus"

          />

          {/* SOURCE */}

          <FormInput

            type="text"

            placeholder="Source City"

            value={tripData.source_city}

            onChange={(e) =>

              setTripData({

                ...tripData,

                source_city:
                  e.target.value

              })

            }

            required

          />

          {/* DESTINATION */}

          <FormInput

            type="text"

            placeholder="Destination City"

            value={tripData.destination_city}

            onChange={(e) =>

              setTripData({

                ...tripData,

                destination_city:
                  e.target.value

              })

            }

            required

          />

          {/* DEPARTURE */}

          <FormInput

            type="datetime-local"

            value={tripData.departure_datetime}

            onChange={(e) =>

              setTripData({

                ...tripData,

                departure_datetime:
                  e.target.value

              })

            }

            required

          />

          {/* ARRIVAL */}

          <FormInput

            type="datetime-local"

            value={tripData.arrival_datetime}

            onChange={(e) =>

              setTripData({

                ...tripData,

                arrival_datetime:
                  e.target.value

              })

            }

            required

          />

          {/* FARE */}

          <FormInput

            type="number"

            placeholder="Fare Amount"

            value={tripData.fare}

            onChange={(e) =>

              setTripData({

                ...tripData,

                fare: e.target.value

              })

            }

            required

          />

          {/* STATUS ONLY IN EDIT */}

          {

            editingTripId && (

              <CustomDropdown

                options={[

                  "Scheduled",

                  "Running",

                  "Completed",

                  "Cancelled"

                ]}

                value={tripData.trip_status}

                onChange={(value) =>

                  setTripData({

                    ...tripData,

                    trip_status: value

                  })

                }

                placeholder="Trip Status"

              />

            )

          }

          {/* BUTTON */}

          <button

            type="submit"

            disabled={submitLoading}

            className="

              w-full
              h-16

              rounded-[22px]

              bg-red-500
              hover:bg-red-600

              transition-all
              duration-300

              font-black
              text-[20px]

              mt-4

            "

          >

            {

              submitLoading

                ? "Please wait..."

                : editingTripId

                ? "Update Trip"

                : "Add Trip"

            }

          </button>

        </form>

      </Modal>

    </div>

  );

}

export default TripManagement;