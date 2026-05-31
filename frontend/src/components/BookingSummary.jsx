function BookingSummary({

  selectedSeats = [],

  onContinue

}) {

  /*
  ============================================
  TOTAL PASSENGERS
  ============================================
  */

  const passengerCount =
    selectedSeats.length;

  return (

    <div className="booking-summary">

      {/* TITLE */}

      <h2 className="summary-title">

        Booking Summary

      </h2>

      {/* SELECTED SEATS */}

      <div>

        <div className="text-zinc-400">

          Selected Seats

        </div>

        <div className="selected-seats">

          {

            selectedSeats.length > 0

              ? selectedSeats

                  .map(

                    (seat) =>

                      seat.seat_number

                  )

                  .join(", ")

              : "No seats selected"

          }

        </div>

      </div>

      {/* PASSENGER COUNT */}

      <div className="

        mt-5

        text-zinc-300

      ">

        Passenger Count:

        {" "}

        <span className="

          font-bold
          text-white

        ">

          {passengerCount}

        </span>

      </div>

      {/* LEGEND */}

      <div className="legend">

        {/* AVAILABLE */}

        <div className="legend-item">

          <div className="

            legend-color
            legend-available

          "></div>

          Available

        </div>

        {/* SELECTED */}

        <div className="legend-item">

          <div className="

            legend-color
            legend-selected

          "></div>

          Selected

        </div>

        {/* BOOKED */}

        <div className="legend-item">

          <div className="

            legend-color
            legend-booked

          "></div>

          Booked

        </div>

        {/* LOCKED */}

        <div className="legend-item">

          <div className="

            legend-color
            legend-locked

          "></div>

          Locked

        </div>

        {/* WOMEN */}

        <div className="legend-item">

          <div className="

            legend-color
            legend-women

          "></div>

          Women Only

        </div>

      </div>

      {/* BUTTON */}

      <button

        className="summary-button"

        disabled={
          selectedSeats.length === 0
        }

        onClick={onContinue}

      >

        Continue Booking

      </button>

    </div>

  );

}

export default BookingSummary;