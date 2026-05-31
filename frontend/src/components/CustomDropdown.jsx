import {

  useState

} from "react";

import {

  ChevronDown

} from "lucide-react";

function CustomDropdown({

  options = [],

  value,

  onChange,

  placeholder

}) {

  const [

    open,
    setOpen

  ] = useState(false);

  return (

    <div className="relative">

      {/* SELECT BOX */}

      <button

        type="button"

        onClick={() =>
          setOpen(!open)
        }

        className="

          w-full

          h-[72px]

          bg-[#121218]

          border
          border-zinc-700

          rounded-[22px]

          px-6

          flex
          items-center
          justify-between

          text-left

          text-white

          hover:border-red-500

          transition-all
          duration-300

        "

      >

        <span className="

          text-[17px]

          text-white

        ">

          {

            value ||

            placeholder ||

            "Select"

          }

        </span>

        <ChevronDown

          size={22}

          className={`

            transition-all
            duration-300

            ${

              open

              ? "rotate-180"

              : ""

            }

          `}

        />

      </button>

      {/* OPTIONS */}

      {

        open && (

          <div className="

            absolute

            top-[82px]
            left-0

            w-full

            bg-[#121218]

            border
            border-zinc-700

            rounded-[22px]

            overflow-hidden

            z-50

          ">

            {

              options.map(

                (option, index) => (

                  <button

                    key={index}

                    type="button"

                    onClick={() => {

                      onChange(option);

                      setOpen(false);

                    }}

                    className="

                      w-full

                      px-6
                      py-5

                      text-left

                      text-white

                      hover:bg-red-500/10

                      transition-all
                      duration-300

                      border-b
                      border-zinc-800

                      last:border-none

                    "

                  >

                    {option}

                  </button>

                )

              )

            }

          </div>

        )

      }

    </div>

  );

}

export default CustomDropdown;