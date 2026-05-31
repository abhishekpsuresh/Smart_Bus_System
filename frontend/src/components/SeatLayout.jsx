import {

   CircleDot

} from "lucide-react";

import SeatCard from "./SeatCard";

function SeatLayout({

  seats = [],

  selectedSeats = [],

  onSeatClick,

  trip

}) {

  /*
  ============================================
  GROUP SEATS
  ============================================
  */

  const groupedSeats = {};

  seats.forEach((seat) => {

    const groupId =
      seat.seat_group_id;

    if (!groupedSeats[groupId]) {

      groupedSeats[groupId] = [];

    }

    groupedSeats[groupId].push(seat);

  });

  /*
  ============================================
  SORT GROUP IDS
  ============================================
  */

  const sortedGroupIds =

    Object.keys(groupedSeats)

      .map(Number)

      .sort((a, b) => a - b);

  /*
  ============================================
  GET SEAT
  ============================================
  */

  const getSeat = (

    groupSeats,
    filters

  ) => {

    return groupSeats.find(

      (seat) => {

        return Object.keys(filters)

          .every((key) =>

            seat[key] ===
            filters[key]

          );

      }

    );

  };

  return (

    <div className="seat-layout-wrapper">

      {/* DRIVER */}

      <div className="driver-section">

        DRIVER

      </div>

      {/* HEADERS */}

      <div className="deck-header-row">

        {/* LOWER */}

        <div className="deck-header">

          <div className="deck-title">

            LOWER

          </div>

          <div className="steering-box">

            <CircleDot

              size={30}

            />

          </div>

        </div>

        {/* UPPER */}

        <div className="deck-title">

          UPPER

        </div>

      </div>

      {/* ROWS */}

      <div className="seat-rows">

        {

          sortedGroupIds.map(

            (groupId) => {

              const groupSeats =
                groupedSeats[groupId];

              const lowerLeft =
                getSeat(

                  groupSeats,

                  {

                    seat_type:
                    "Lower",

                    layout_side:
                    "Left"

                  }

                );

              const lowerRightAisle =
                getSeat(

                  groupSeats,

                  {

                    seat_type:
                    "Lower",

                    seat_position:
                    "Aisle"

                  }

                );

              const lowerRightWindow =
                getSeat(

                  groupSeats,

                  {

                    seat_type:
                    "Lower",

                    seat_position:
                    "Window"

                  }

                );

              const upperLeft =
                getSeat(

                  groupSeats,

                  {

                    seat_type:
                    "Upper",

                    layout_side:
                    "Left"

                  }

                );

              const upperRightAisle =
                getSeat(

                  groupSeats,

                  {

                    seat_type:
                    "Upper",

                    seat_position:
                    "Aisle"

                  }

                );

              const upperRightWindow =
                getSeat(

                  groupSeats,

                  {

                    seat_type:
                    "Upper",

                    seat_position:
                    "Window"

                  }

                );

              return (

                <div

                  key={groupId}

                  className="seat-row"

                >

                  {/* LOWER */}

                  <div className="deck-side">

                    {/* LEFT */}

                    <div className="single-seat">

                      {

                        lowerLeft && (

                          <SeatCard

                            seat={lowerLeft}

                            fare={trip?.fare}

                            selectedSeats={
                              selectedSeats
                            }

                            onSeatClick={
                              onSeatClick
                            }

                          />

                        )

                      }

                    </div>

                    {/* AISLE */}

                    <div className="aisle">

                      AISLE

                    </div>

                    {/* RIGHT */}

                    <div className="double-seat">

                      {

                        lowerRightAisle && (

                          <SeatCard

                            seat={
                              lowerRightAisle
                            }

                            fare={trip?.fare}

                            selectedSeats={
                              selectedSeats
                            }

                            onSeatClick={
                              onSeatClick
                            }

                          />

                        )

                      }

                      {

                        lowerRightWindow && (

                          <SeatCard

                            seat={
                              lowerRightWindow
                            }

                            fare={trip?.fare}

                            selectedSeats={
                              selectedSeats
                            }

                            onSeatClick={
                              onSeatClick
                            }

                          />

                        )

                      }

                    </div>

                  </div>

                  {/* UPPER */}

                  <div className="deck-side">

                    {/* LEFT */}

                    <div className="single-seat">

                      {

                        upperLeft && (

                          <SeatCard

                            seat={upperLeft}

                            fare={trip?.fare}

                            selectedSeats={
                              selectedSeats
                            }

                            onSeatClick={
                              onSeatClick
                            }

                          />

                        )

                      }

                    </div>

                    {/* AISLE */}

                    <div className="aisle">

                      AISLE

                    </div>

                    {/* RIGHT */}

                    <div className="double-seat">

                      {

                        upperRightAisle && (

                          <SeatCard

                            seat={
                              upperRightAisle
                            }

                            fare={trip?.fare}

                            selectedSeats={
                              selectedSeats
                            }

                            onSeatClick={
                              onSeatClick
                            }

                          />

                        )

                      }

                      {

                        upperRightWindow && (

                          <SeatCard

                            seat={
                              upperRightWindow
                            }

                            fare={trip?.fare}

                            selectedSeats={
                              selectedSeats
                            }

                            onSeatClick={
                              onSeatClick
                            }

                          />

                        )

                      }

                    </div>

                  </div>

                </div>

              );

            }

          )

        }

      </div>

    </div>

  );

}

export default SeatLayout;