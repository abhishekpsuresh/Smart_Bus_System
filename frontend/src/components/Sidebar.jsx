import {
  motion,
  AnimatePresence
} from "framer-motion";

import {
  X,
  LogOut
} from "lucide-react";

function Sidebar({

  sidebarOpen,
  setSidebarOpen,

  title = "Smart Bus",
  subtitle = "Dashboard",

  menuItems = [],

  activeSection,
  setActiveSection,

  handleLogout

}) {

  return (

    <AnimatePresence>

      {

        sidebarOpen && (

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

              onClick={() =>
                setSidebarOpen(false)
              }

              className="

                fixed inset-0

                bg-black/40

                backdrop-blur-sm

                z-40

              "

            />

            {/* SIDEBAR */}

            <motion.div

              initial={{
                x: -320
              }}

              animate={{
                x: 0
              }}

              exit={{
                x: -320
              }}

              transition={{
                duration: 0.3
              }}

              className="

                fixed top-0 left-0

                h-full
                w-[290px]

                bg-black/95

                border-r
                border-zinc-800

                z-50

                flex
                flex-col

              "

            >

              {/* HEADER */}

              <div className="p-6">

                <div className="

                  flex
                  justify-between
                  items-start

                ">

                  <div>

                    {/* TITLE */}

                    <h1 className="

                      text-[42px]
                      font-black

                      leading-[0.9]

                      text-red-500

                    ">

                      {title}

                    </h1>

                    {/* SUBTITLE */}

                    <p className="

                      text-zinc-400

                      text-[15px]

                      mt-3

                    ">

                      {subtitle}

                    </p>

                  </div>

                  {/* CLOSE */}

                  <button

                    onClick={() =>
                      setSidebarOpen(false)
                    }

                    className="mt-1"

                  >

                    <X
                      size={30}
                      className="text-white"
                    />

                  </button>

                </div>

              </div>

              {/* LINE */}

              <div className="

                h-[1px]
                bg-zinc-800

                w-full

              " />

              {/* MENU */}

              <div className="

                flex-1

                p-4

                space-y-4

              ">

                {

                  menuItems.map((item) => {

                    const Icon =
                    item.icon;

                    const active =
                    activeSection === item.key;

                    return (

                      <button

                        key={item.key}

                        onClick={() => {

                          setActiveSection(
                            item.key
                          );

                          setSidebarOpen(false);

                        }}

                        className={`

                          w-full

                          flex
                          items-center
                          gap-4

                          px-5
                          py-4

                          rounded-[22px]

                          transition-all
                          duration-300

                          text-[18px]

                          ${

                            active

                            ? "bg-red-500 text-white"

                            : "bg-zinc-900 hover:bg-zinc-800"

                          }

                        `}
                      >

                        <Icon size={24} />

                        {item.label}

                      </button>

                    );

                  })

                }

              </div>

              {/* BOTTOM */}

              <div>

                {/* TOP LINE */}

                <div className="

                  h-[1px]
                  bg-zinc-800

                  w-full

                " />

                {/* LOGOUT */}

                <div className="p-5">

                  <button

                    onClick={handleLogout}

                    className="

                      w-full

                      bg-red-500
                      hover:bg-red-600

                      py-4

                      rounded-[22px]

                      flex
                      items-center
                      justify-center
                      gap-3

                      text-[18px]

                      transition-all
                      duration-300

                    "

                  >

                    <LogOut size={22} />

                    Logout

                  </button>

                </div>

              </div>

            </motion.div>

          </>

        )

      }

    </AnimatePresence>

  );

}

export default Sidebar;