import {

  useEffect,
  useState,
  useCallback

} from "react";

import {

  useParams,
  useNavigate

} from "react-router-dom";

import axios from "axios";

import {

  Bus

} from "lucide-react";

import {

  toast

} from "react-hot-toast";

import SeatLayout
from "../../components/SeatLayout";

import BookingSummary
from "../../components/BookingSummary";

import PassengerModal
from "../../components/PassengerModal";

import ReservationTimer
from "../../components/ReservationTimer";

import "./SeatSelection.css";

function SeatSelection() {

  /*
  ============================================
  NAVIGATION
  ============================================
  */

  const navigate =
    useNavigate();

  /*
  ============================================
  PARAMS
  ============================================
  */

  const { trip_id } =
    useParams();

  /*
  ============================================
  STATES
  ============================================
  */

  const [trip, setTrip] =
    useState(null);

  const [seats, setSeats] =
    useState([]);

  const [

    selectedSeats,
    setSelectedSeats

  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [

    passengerModalOpen,
    setPassengerModalOpen

  ] = useState(false);

  const [

    reservationStarted,
    setReservationStarted

  ] = useState(false);

  const [

    reservationPassengers,
    setReservationPassengers

  ] = useState([]);

  /*
  ============================================
  FETCH TRIP
  ============================================
  */

  const fetchTrip =
    useCallback(

      async () => {

        try {

          const response =
            await axios.get(

              `http://localhost:5000/api/trips/single/${trip_id}`

            );

          setTrip(
            response.data
          );

          return response.data;

        }

        catch (error) {

          console.log(error);

          toast.error(
            "Failed to load trip"
          );

          return null;

        }

      },

      [trip_id]

    );

  /*
  ============================================
  FETCH SEATS
  ============================================
  */

  const fetchSeats =
    async (tripId) => {

      try {

        const response =
          await axios.get(

            `http://localhost:5000/api/seats/${tripId}`

          );

        setSeats(

          Array.isArray(
            response.data.seats
          )

            ? response.data.seats

            : []

        );

      }

      catch (error) {

        console.log(error);

        toast.error(
          "Failed to load seats"
        );

      }

    };

  /*
  ============================================
  LOAD
  ============================================
  */

  useEffect(() => {

    const loadData =
      async () => {

        setLoading(true);

        const tripData =
          await fetchTrip();

        if (
          tripData?.bus_id
        ) {

          await fetchSeats(
            trip_id
          );

        }

        setLoading(false);

      };

    loadData();

  }, [fetchTrip, trip_id]);

  /*
  ============================================
  CLICK SEAT
  ============================================
  */

  const handleSeatClick =
    (seat) => {

      /*
      ----------------------------------------
      BLOCKED
      ----------------------------------------
      */

      if (

        seat.seat_status ===
        "Booked"

      ) {

        return;

      }

      if (

        seat.seat_status ===
        "Locked"

      ) {

        return;

      }

      /*
      ----------------------------------------
      ALREADY SELECTED
      ----------------------------------------
      */

      const alreadySelected =
        selectedSeats.find(

          (selectedSeat) =>

            selectedSeat.id ===
            seat.id

        );

      /*
      ----------------------------------------
      REMOVE
      ----------------------------------------
      */

      if (alreadySelected) {

        setSelectedSeats(

          selectedSeats.filter(

            (selectedSeat) =>

              selectedSeat.id !==
              seat.id

          )

        );

      }

      /*
      ----------------------------------------
      ADD
      ----------------------------------------
      */

      else {

        setSelectedSeats([

          ...selectedSeats,

          seat

        ]);

      }

    };

  /*
  ============================================
  CONTINUE BOOKING
  ============================================
  */

  const handleContinueBooking =
    () => {

      if (
        selectedSeats.length === 0
      ) {

        toast.error(
          "Select seats first"
        );

        return;

      }

      setPassengerModalOpen(true);

    };

  /*
  ============================================
  PASSENGER SUBMIT
  ============================================
  */

  const handlePassengerSubmit =
    async (passengers) => {

      try {

        console.log(

          "Passengers:",
          passengers

        );

        const token =
          localStorage.getItem(
            "token"
          );

        /*
        ========================================
        TOTAL AMOUNT
        ========================================
        */

        const totalAmount =
  Number(trip?.fare || 0) *
  selectedSeats.length;

        /*
        ========================================
        RESERVATION CODE
        ========================================
        */

        const reservationCode =

          `RSV${Date.now()}`;

        /*
        ========================================
        CREATE RESERVATION
        ========================================
        */

        const response =
          await axios.post(

            "http://localhost:5000/api/reservations/create",

            {

              reservation_code:
                reservationCode,

              user_id: 1,

              trip_id:
                trip_id,

              total_amount:
                totalAmount,

              passengers:
                passengers.map(

                  (passenger, index) => ({

                    seat_id:
                      selectedSeats[index].id,

                    passenger_name:
                      passenger.passenger_name,

                    passenger_gender:
                      passenger.passenger_gender,

                    passenger_age:
                      passenger.passenger_age,

                    copassenger_preference:
                      passenger.copassenger_preference

                  })

                )

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        console.log(response.data);

        /*
        ========================================
        STORE PASSENGERS
        ========================================
        */

        setReservationPassengers(
          passengers
        );

        /*
        ========================================
        CLOSE MODAL
        ========================================
        */

        setPassengerModalOpen(
          false
        );

        /*
        ========================================
        START TIMER
        ========================================
        */

        setReservationStarted(
          true
        );

        toast.success(

          "Reservation created"

        );

        /*
        ========================================
        NAVIGATE PAYMENT PAGE
        ========================================
        */

        navigate(

          "/payment",

          {

            state: {

              reservation_request_id:

                response.data
                  .reservation_request_id,

              total_amount:
                totalAmount,

              selectedSeats,

              passengers,

              trip,

              reservationStartTime:
                Date.now()

            }

          }

        );

      }

      catch (error) {

        console.log(error);

        toast.error(
          "Reservation failed"
        );

      }

    };

  /*
  ============================================
  TIMER EXPIRE
  ============================================
  */

  const handleReservationExpire =
    () => {

      setReservationStarted(false);

      setSelectedSeats([]);

      setReservationPassengers([]);

      toast.error(

        "Reservation expired"

      );

    };

  /*
  ============================================
  LOADING
  ============================================
  */

  if (loading) {

    return (

      <div className="

        min-h-screen

        flex
        items-center
        justify-center

        bg-black

        text-white

        text-2xl
        font-bold

      ">

        Loading Seats...

      </div>

    );

  }

  return (

    <div className="seat-selection-page">

      <div className="seat-selection-container">

        {/* TOP */}

        <div className="seat-top">

          {/* LEFT */}

          <div>

            <div className="

              flex
              items-center
              gap-4

              mb-3

            ">

              <Bus

                size={38}

                color="#ff2b3d"

              />

              <h1 className="seat-title">

                Seat Selection

              </h1>

            </div>

            {

              trip && (

                <p className="seat-subtitle">

                  {

                    trip.source_city

                  }

                  {" → "}

                  {

                    trip.destination_city

                  }

                </p>

              )

            }

          </div>

          {/* RIGHT */}

          {

            trip && (

              <div className="

                text-right

              ">

                <div className="

                  text-zinc-400
                  text-sm

                  mb-1

                ">

                  Bus

                </div>

                <div className="

                  text-xl
                  font-bold

                ">

                  {

                    trip.bus_name

                  }

                </div>

              </div>

            )

          }

        </div>

        {/* SEAT LAYOUT */}

        <SeatLayout

          seats={seats}

          trip={trip}

          selectedSeats={
            selectedSeats
          }

          onSeatClick={
            handleSeatClick
          }

        />

        {/* BOOKING SUMMARY */}

        <BookingSummary

          selectedSeats={
            selectedSeats
          }

          onContinue={
            handleContinueBooking
          }

        />

        {/* TIMER */}

        {

          reservationStarted && (

            <ReservationTimer

              initialSeconds={600}

              onExpire={
                handleReservationExpire
              }

            />

          )

        }

        {/* PASSENGER MODAL */}

        <PassengerModal

          isOpen={
            passengerModalOpen
          }

          onClose={() =>

            setPassengerModalOpen(
              false
            )

          }

          selectedSeats={
            selectedSeats
          }

          onSubmit={
            handlePassengerSubmit
          }

        />

      </div>

    </div>

  );

}

export default SeatSelection;