import { motion } from "framer-motion";

function DashboardCard({

  title = "",
  description = "",
  icon: Icon,
  value = null,
  onClick

}) {

  return (

    <motion.div

      whileHover={{

        y: -4,
        scale: 1.01

      }}

      whileTap={{

        scale: 0.98

      }}

      onClick={onClick}

      className="

        bg-zinc-950
        border
        border-zinc-800

        rounded-3xl

        p-6

        cursor-pointer

        hover:border-red-500

        transition-all
        duration-300

      "

    >

      {/* TOP */}

      <div className="

        flex
        items-start
        justify-between

        mb-5

      ">

        {/* ICON */}

        <div className="

          w-14
          h-14

          rounded-2xl

          bg-red-500/15

          flex
          items-center
          justify-center

        ">

          {

            Icon && (

              <Icon

                size={28}

                className="text-red-500"

              />

            )

          }

        </div>

        {/* VALUE */}

        {

          value !== null && (

            <h2 className="

              text-3xl
              font-bold

              text-white

            ">

              {value}

            </h2>

          )

        }

      </div>

      {/* TITLE */}

      <h2 className="

        text-xl
        font-bold

        text-white

        mb-2

      ">

        {title}

      </h2>

      {/* DESCRIPTION */}

      {

        description && (

          <p className="

            text-zinc-400

            text-sm

            leading-relaxed

          ">

            {description}

          </p>

        )

      }

    </motion.div>

  );

}

export default DashboardCard;