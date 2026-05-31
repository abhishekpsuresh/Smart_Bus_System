import { motion } from "framer-motion";

function SeatCard({

  seat,
  fare,
  selectedSeats = [],
  onSeatClick

}) {

  /*
  ============================================
  SELECTED
  ============================================
  */

  const isSelected =
    selectedSeats.some(

      (selectedSeat) =>

        selectedSeat.id === seat.id

    );

  /*
  ============================================
  CLASS
  ============================================
  */

  const getSeatClass = () => {

    // BOOKED

    if (
      seat.seat_status === "Booked"
    ) {

      return "booked";

    }

    // LOCKED

    if (
      seat.seat_status === "Locked"
    ) {

      return "locked";

    }

    // WOMEN ONLY

    if (
      seat.seat_status === "WomenOnly"
    ) {

      return "women";

    }

    // SELECTED

    if (isSelected) {

      return "selected";

    }

    // DEFAULT

    return "available";

  };

  /*
  ============================================
  CLICK
  ============================================
  */

  const handleClick = () => {

    if (

      seat.seat_status === "Booked" ||

      seat.seat_status === "Locked"

    ) {

      return;

    }

    onSeatClick(seat);

  };

  return (

    <motion.div

      whileHover={{

        scale:

          seat.seat_status ===
          "Available"

            ? 1.05

            : 1

      }}

      whileTap={{

        scale: 0.96

      }}

      onClick={handleClick}

      className={`seat-card ${getSeatClass()}`}

    >

      {/* FARE */}

      <div className="seat-number">

        ₹{fare || 0}

      </div>

    </motion.div>

  );

}

export default SeatCard;