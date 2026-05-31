import {
  Menu
} from "lucide-react";

function Navbar({

  user = {},

  role = "User",

  onMenuClick = () => {}

}) {

  return (

    <div className="

      w-full

      h-[82px]

      border-b
      border-zinc-800

      bg-black

      flex
      items-center
      justify-between

      px-6

      sticky
      top-0

      z-30

    ">

      {/* LEFT */}

      <div className="

        flex
        items-center
        gap-4

      ">

        {/* MENU */}

        <button

          type="button"

          onClick={onMenuClick}

          className="

            text-white

            hover:text-red-500

            transition-all
            duration-300

          "

        >

          <Menu size={28} />

        </button>

        {/* TITLE */}

        <div>

          <h1 className="

            text-[24px]
            font-black

            text-red-500

            leading-none

          ">

            Smart Bus

          </h1>

          <p className="

            text-zinc-400

            text-[13px]

            mt-1

          ">

            {role} Panel

          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="text-right">

        <h2 className="

          text-[17px]
          font-semibold

          text-white

        ">

          {

            user?.full_name ||

            user?.company_name ||

            "User"

          }

        </h2>

        <p className="

          text-zinc-400

          text-[13px]

          mt-1

        ">

          {

            user?.role

            ? `${

                user.role.charAt(0)
                .toUpperCase()

              }${

                user.role.slice(1)

              }`

            : role

          }

        </p>

      </div>

    </div>

  );

}

export default Navbar;