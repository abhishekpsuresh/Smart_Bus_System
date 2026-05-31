import {

  useState,
  useEffect

} from "react";

import {

  X

} from "lucide-react";

function PassengerModal({

  isOpen,

  onClose,

  selectedSeats = [],

  onSubmit

}) {

  /*
  ============================================
  STATES
  ============================================
  */

  const [

    passengers,
    setPassengers

  ] = useState([]);

  /*
  ============================================
  REFRESH PASSENGERS
  ============================================
  */

  /* eslint-disable react-hooks/set-state-in-effect */

useEffect(() => {

  if (

    !isOpen ||

    selectedSeats.length === 0

  ) {

    return;

  }

setPassengers(

  selectedSeats.map((seat) => {

    const isWomenOnly =
      seat.seat_status === "WomenOnly";

    return {

      seat_number: seat.seat_number,

      passenger_name: "",

      passenger_age: "",

      passenger_gender:
        isWomenOnly
          ? "Female"
          : "Male",

      copassenger_preference:
        "No Preference",

      isWomenOnly

    };

  })

);

}, [

  isOpen,
  selectedSeats

]);

  /*
  ============================================
  CHANGE
  ============================================
  */

const handleChange = (

  index,
  field,
  value

) => {

  const updated =
    [...passengers];

  updated[index] = {

    ...updated[index],

    [field]: value

  };

  if (

    field === "passenger_gender" &&

    value === "Male"

  ) {

    updated[index]
      .copassenger_preference =
      "No Preference";

  }

  setPassengers(updated);

};

  /*
  ============================================
  SUBMIT
  ============================================
  */

  const handleSubmit =
    () => {

      for (

        const passenger
        of passengers

      ) {

        if (

          !passenger.passenger_name ||

          !passenger.passenger_age ||

          !passenger.passenger_gender

        ) {

          alert(

            "Please fill all passenger details"

          );

          return;

        }

      }

      onSubmit(passengers);

    };

  /*
  ============================================
  CLOSE
  ============================================
  */

  if (!isOpen) {

    return null;

  }

  return (

    <div className="

      fixed
      inset-0

      bg-black/70

      backdrop-blur-sm

      z-50

      flex
      items-center
      justify-center

      p-4

    ">

      <div className="

        w-full
        max-w-3xl

        bg-zinc-950

        border
        border-zinc-800

        rounded-[32px]

        p-8

        max-h-[90vh]

        overflow-y-auto

      ">

        {/* TOP */}

        <div className="

          flex
          items-center
          justify-between

          mb-8

        ">

          <div>

            <h2 className="

              text-3xl
              font-black

              text-white

            ">

              Passenger Details

            </h2>

            <p className="

              text-zinc-400

              mt-2

            ">

              Fill passenger information

            </p>

          </div>

          <button

            onClick={onClose}

            className="

              w-12
              h-12

              rounded-2xl

              bg-zinc-900

              flex
              items-center
              justify-center

              hover:bg-zinc-800

              transition-all

            "

          >

            <X size={22} />

          </button>

        </div>

        {/* PASSENGERS */}

        <div className="space-y-8">

          {

            passengers.map(

              (

                passenger,
                index

              ) => (

                <div

                  key={index}

                  className="

                    bg-black

                    border
                    border-zinc-800

                    rounded-[28px]

                    p-6

                  "

                >

                  {/* TITLE */}

                  <div className="mb-6">

                    <h3 className="

                      text-xl
                      font-bold

                    ">

                      Seat {

                        passenger.seat_number

                      }

                    </h3>

                  </div>

                  {/* GRID */}

                  <div className="

                    grid

                    grid-cols-1
                    md:grid-cols-2

                    gap-5

                  ">

                    {/* NAME */}

                    <input

                      type="text"

                      placeholder="Passenger Name"

                      value={
                        passenger.passenger_name
                      }

                      onChange={(e) =>

                        handleChange(

                          index,

                          "passenger_name",

                          e.target.value

                        )

                      }

                      className="

                        h-[58px]

                        bg-zinc-900

                        border
                        border-zinc-700

                        rounded-2xl

                        px-5

                        outline-none

                        focus:border-red-500

                      "

                    />

                    {/* AGE */}

                    <input

                      type="number"

                      placeholder="Passenger Age"

                      value={
                        passenger.passenger_age
                      }

                      onChange={(e) =>

                        handleChange(

                          index,

                          "passenger_age",

                          e.target.value

                        )

                      }

                      className="

                        h-[58px]

                        bg-zinc-900

                        border
                        border-zinc-700

                        rounded-2xl

                        px-5

                        outline-none

                        focus:border-red-500

                      "

                    />

                    {/* GENDER */}

    <select
  value={
    passenger.passenger_gender
  }

  disabled={
    passenger.isWomenOnly
  }
  onChange={(e) =>

    handleChange(

      index,

      "passenger_gender",

      e.target.value

    )

  }

  className="

    h-[58px]

    bg-zinc-900

    border
    border-zinc-700

    rounded-2xl

    px-5

    outline-none

    focus:border-red-500

  "

>

    <option value="">
    Select Gender
  </option>
  
  <option value="Male">
    Male
  </option>

  <option value="Female">
    Female
  </option>

</select>

                    {/* PREFERENCE */}

                    <select

  value={
    passenger.copassenger_preference
  }

  disabled={
    passenger.passenger_gender ===
    "Male"
  }

  onChange={(e) =>

    handleChange(

      index,

      "copassenger_preference",

      e.target.value

    )

  }

  className={`

    h-[58px]

    bg-zinc-900

    border
    border-zinc-700

    rounded-2xl

    px-5

    outline-none

    focus:border-red-500

    ${
      passenger.passenger_gender ===
      "Male"
        ? "opacity-60 cursor-not-allowed"
        : ""
    }

  `}

>

  <option value="">
    Select Preference
  </option>
  
  <option value="No Preference">
    No Preference
  </option>

  <option value="Female Only">
    Female Only
  </option>

</select>

                  </div>

                </div>

              )

            )

          }

        </div>

        {/* BUTTON */}

        <button

          onClick={handleSubmit}

          className="

            mt-8

            w-full

            h-[60px]

            bg-red-500
            hover:bg-red-600

            rounded-2xl

            font-bold
            text-lg

            transition-all

          "

        >

          Continue To Payment

        </button>

      </div>

    </div>

  );

};

export default PassengerModal;