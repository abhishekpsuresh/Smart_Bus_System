import {

  useEffect,
  useState

} from "react";

function ReservationTimer({

  initialSeconds = 600,

  onExpire

}) {

  /*
  ============================================
  TIMER
  ============================================
  */

  const [

    seconds,
    setSeconds

  ] = useState(
    initialSeconds
  );

  /*
  ============================================
  COUNTDOWN
  ============================================
  */

  useEffect(() => {

    if (seconds <= 0) {

      onExpire &&
      onExpire();

      return;

    }

    const timer =
      setInterval(() => {

        setSeconds(

          (prev) => prev - 1

        );

      }, 1000);

    return () =>

      clearInterval(timer);

  }, [seconds, onExpire]);

  /*
  ============================================
  FORMAT
  ============================================
  */

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  const formattedTime =
    `${String(minutes)

      .padStart(2, "0")}

     :

     ${String(remainingSeconds)

      .padStart(2, "0")}`;

  return (

    <div className="

      bg-yellow-500/10

      border
      border-yellow-500/30

      rounded-2xl

      px-5
      py-4

      flex
      items-center
      justify-between

      gap-5

      mt-6

    ">

      {/* LEFT */}

      <div>

        <div className="

          text-sm
          text-yellow-300

          mb-1

        ">

          Reservation Timer

        </div>

        <div className="

          text-zinc-300
          text-sm

        ">

          Complete payment before reservation expires

        </div>

      </div>

      {/* RIGHT */}

      <div className="

        text-3xl
        font-black

        text-yellow-400

        tracking-wider

      ">

        {formattedTime}

      </div>

    </div>

  );

}

export default ReservationTimer;