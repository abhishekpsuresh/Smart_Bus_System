import {
  motion,
  AnimatePresence
} from "framer-motion";

import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  X
} from "lucide-react";

function Notification({

  show,
  type = "success",

  message,

  onClose

}) {

  /*
  ============================================
  ICONS
  ============================================
  */

  const icons = {

    success: CheckCircle,

    error: XCircle,

    warning: AlertTriangle,

    info: Info

  };

  /*
  ============================================
  COLORS
  ============================================
  */

  const styles = {

    success: {

      container:
      "bg-green-600 border-green-400",

      text:
      "text-white"

    },

    error: {

      container:
      "bg-red-600 border-red-400",

      text:
      "text-white"

    },

    warning: {

      container:
      "bg-yellow-500 border-yellow-300",

      text:
      "text-black"

    },

    info: {

      container:
      "bg-blue-600 border-blue-400",

      text:
      "text-white"

    }

  };

  const Icon =
  icons[type];

  return (

    <AnimatePresence>

      {

        show && (

          <motion.div

            initial={{
              opacity: 0,
              y: -40,
              scale: 0.95
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}

            exit={{
              opacity: 0,
              y: -40,
              scale: 0.95
            }}

            transition={{
              duration: 0.25
            }}

            className="

              fixed

              top-6
              left-1/2

              -translate-x-1/2

              z-[9999]

            "

          >

            <div className={`

              min-w-[420px]
              max-w-[650px]

              px-6
              py-5

              rounded-[22px]

              border-2

              shadow-2xl

              flex
              items-center
              justify-between
              gap-5

              ${styles[type].container}

            `}>

              {/* LEFT */}

              <div className="

                flex
                items-center
                gap-4

              ">

                <Icon

                  size={30}

                  className={styles[type].text}

                />

                <p className={`

                  text-[19px]
                  font-semibold

                  ${styles[type].text}

                `}>

                  {message}

                </p>

              </div>

              {/* CLOSE */}

              <button
                onClick={onClose}
              >

                <X

                  size={24}

                  className={styles[type].text}

                />

              </button>

            </div>

          </motion.div>

        )

      }

    </AnimatePresence>

  );

}

export default Notification;