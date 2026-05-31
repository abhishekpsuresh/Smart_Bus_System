import {
  motion,
  AnimatePresence
} from "framer-motion";

import {
  X
} from "lucide-react";

function Modal({

  isOpen,
  onClose,

  title,

  children,

  maxWidth = "max-w-2xl"

}) {

  return (

    <AnimatePresence>

      {

        isOpen && (

          <>

            {/* OVERLAY */}

            <motion.div

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: 1
              }}

              exit={{
                opacity: 0
              }}

              onClick={onClose}

              className="

                fixed inset-0

                bg-black/60

                backdrop-blur-sm

                z-40

              "

            />

            {/* MODAL */}

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.92
              }}

              animate={{
                opacity: 1,
                scale: 1
              }}

              exit={{
                opacity: 0,
                scale: 0.92
              }}

              transition={{
                duration: 0.25
              }}

              className="

                fixed inset-0

                flex
                items-center
                justify-center

                z-50

                p-5

              "

            >

              <div className={`

                w-full

                ${maxWidth}

                bg-black/95

                border
                border-zinc-800

                rounded-[30px]

                p-7

                shadow-2xl

              `}>

                {/* TOP */}

                <div className="

                  flex
                  justify-between
                  items-center

                  mb-7

                ">

                  {/* TITLE */}

                  <h2 className="

                    text-[38px]
                    font-black

                    text-red-500

                    leading-none

                  ">

                    {title}

                  </h2>

                  {/* CLOSE */}

                  <button
                    onClick={onClose}
                  >

                    <X
                      size={30}
                      className="text-white"
                    />

                  </button>

                </div>

                {/* BODY */}

                {children}

              </div>

            </motion.div>

          </>

        )

      }

    </AnimatePresence>

  );

}

export default Modal;