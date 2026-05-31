import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import axios from "axios";

import { Search } from "lucide-react";

import Notification from "../../components/Notification";

import AvailableTrips from "./AvailableTrips";

function SearchTrips() {

  /*
  =========================================
  NAVIGATE
  =========================================
  */

  const navigate =
    useNavigate();

  /*
  =========================================
  STATES
  =========================================
  */

  const [source, setSource] =
    useState("");

  const [
    destination,
    setDestination
  ] = useState("");

  const [
    searchDate,
    setSearchDate
  ] = useState("");

  const [trips, setTrips] =
  useState([]);

const [loading, setLoading] =
  useState(false);

const [showBusModal, setShowBusModal] =
  useState(false);

const [busImages, setBusImages] =
  useState([]);

const [selectedBus, setSelectedBus] =
  useState(null);

  const [
    notification,
    setNotification
  ] = useState({

    show: false,
    message: "",
    type: "success"

  });

  /*
  =========================================
  NOTIFICATION
  =========================================
  */

  const showNotification = (

    message,
    type = "success"

  ) => {

    setNotification({

      show: true,
      message,
      type

    });

    setTimeout(() => {

      setNotification({

        show: false,
        message: "",
        type: "success"

      });

    }, 3000);

  };

  /*
  =========================================
  SEARCH TRIPS
  =========================================
  */

  const handleViewBus = async (busId) => {

  try {

    const response =
      await axios.get(
        `http://localhost:5000/api/buses/${busId}/images`
      );

    setBusImages(
      response.data.images || []
    );

    setSelectedBus(busId);

    setShowBusModal(true);

  }

  catch (error) {

    console.log(error);

    showNotification(
      "Failed to load bus images",
      "error"
    );

  }

};
  

  const handleSearch =
    async () => {

      try {

        if (

          !source.trim() ||
          !destination.trim() ||
          !searchDate

        ) {

          showNotification(

            "Please fill all fields",
            "warning"

          );

          return;

        }

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        /*
        =====================================
        FORMAT DATE
        =====================================
        */

        const formattedDate =

          new Date(searchDate)

            .toISOString()

            .split("T")[0];

        console.log(

          "Searching with:",

          {

            source_city:
              source.trim(),

            destination_city:
              destination.trim(),

            travel_date:
              formattedDate

          }

        );

        /*
        =====================================
        API CALL
        =====================================
        */

        const response =
          await axios.get(

            "http://localhost:5000/api/search-trips",

            {

              params: {

                source_city:
                  source.trim(),

                destination_city:
                  destination.trim(),

                travel_date:
                  formattedDate

              },

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        console.log(
          response.data
        );

        /*
        =====================================
        SUCCESS
        =====================================
        */

        if (
          response.data.success
        ) {

          setTrips(

            response.data.trips || []

          );

          if (

            response.data.trips
              .length === 0

          ) {

            showNotification(

              "No trips found",

              "warning"

            );

          }

          else {

            showNotification(

              "Trips loaded successfully",

              "success"

            );

          }

        }

        /*
        =====================================
        FAILED
        =====================================
        */

        else {

          setTrips([]);

          showNotification(

            "Failed to load trips",

            "error"

          );

        }

      }

      catch (error) {

        console.log(error);

        setTrips([]);

        if (

          error.response
            ?.status === 401

        ) {

          showNotification(

            "Unauthorized access",

            "error"

          );

        }

        else {

          showNotification(

            "Search failed",

            "error"

          );

        }

      }

      finally {

        setLoading(false);

      }

    };

  return (

    <div className="w-full text-white">

      {/* NOTIFICATION */}

      <Notification

        show={
          notification.show
        }

        message={
          notification.message
        }

        type={
          notification.type
        }

      />

      {/* HEADER */}

      <div className="mb-8">

        <h1
          className="
            text-4xl
            font-black
            mb-2
          "
        >

          Search Trips

        </h1>

        <p
          className="
            text-zinc-400
            text-base
          "
        >

          Find available buses

        </p>

      </div>

      {/* SEARCH BOX */}

      <div
        className="
          bg-black
          border
          border-zinc-800
          rounded-[30px]
          p-5
          mb-8
        "
      >

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-4
            gap-4
          "
        >

          {/* FROM */}

          <input

            type="text"

            placeholder="From"

            value={source}

            onChange={(e) =>

              setSource(
                e.target.value
              )

            }

            className="
              h-[60px]
              bg-zinc-900
              border
              border-zinc-700
              rounded-2xl
              px-5
              text-lg
              outline-none
              focus:border-red-500
            "

          />

          {/* TO */}

          <input

            type="text"

            placeholder="To"

            value={destination}

            onChange={(e) =>

              setDestination(
                e.target.value
              )

            }

            className="
              h-[60px]
              bg-zinc-900
              border
              border-zinc-700
              rounded-2xl
              px-5
              text-lg
              outline-none
              focus:border-red-500
            "

          />

          {/* DATE */}

          <input

            type="date"

            value={searchDate}

            onChange={(e) =>

              setSearchDate(
                e.target.value
              )

            }

            className="
              h-[60px]
              bg-zinc-900
              border
              border-zinc-700
              rounded-2xl
              px-5
              text-lg
              outline-none
              focus:border-red-500
            "

          />

          {/* BUTTON */}

          <button

            onClick={handleSearch}

            disabled={loading}

            className="
              h-[60px]
              bg-red-500
              hover:bg-red-600
              rounded-2xl
              text-lg
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition-all
            "

          >

            <Search size={20} />

            {

              loading
                ? "Searching..."
                : "Search"

            }

          </button>

        </div>

      </div>

      {/* RESULTS */}

      <AvailableTrips

  trips={trips}

  loading={loading}

  onViewSeats={(tripId) =>

    navigate(
      `/seat-selection/${tripId}`
    )

  }

  onViewBus={handleViewBus}

/>

{
  showBusModal && (

    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">

      <div className="bg-zinc-900 p-6 rounded-3xl max-w-5xl w-full mx-4">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold">
            Bus Images
          </h2>

          <button
            onClick={() =>
              setShowBusModal(false)
            }
            className="text-red-500 text-3xl"
          >
            ×
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {

            busImages.length > 0

              ? busImages.map((img) => (

                  <img
                    key={img.id}
                    src={`http://localhost:5000${img.image_url}`}
                    alt="Bus"
                    className="w-full h-64 object-cover rounded-xl"
                  />

                ))

              : (

                <div className="text-zinc-400">
                  No Images Found
                </div>

              )

          }

        </div>

      </div>

    </div>

  )
}

    </div>

  );

}

export default SearchTrips;