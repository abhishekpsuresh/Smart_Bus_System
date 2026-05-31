import {
  useState
} from "react";

import {
  Menu,
  Bus,
  Route,
  Home
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import DashboardCard from "../../components/DashboardCard";

import Notification from "../../components/Notification";

import BusManagement
from "./BusManagement";

import TripManagement
from "./TripManagement";

import Bookings
from "./Bookings";

import CancelledBookings
from "./CancelledBookings";

import { Ticket, Ban } from "lucide-react";

function OperatorDashboard() {

  // ============================================
  // NAVIGATION
  // ============================================

  const navigate =
    useNavigate();

  // ============================================
  // USER
  // ============================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // ============================================
  // STATES
  // ============================================

  const [

    sidebarOpen,
    setSidebarOpen

  ] = useState(false);

  const [

    activeSection,
    setActiveSection

  ] = useState("home");

  // ============================================
  // NOTIFICATION
  // ============================================

  const [

    notification,
    setNotification

  ] = useState({

    show: false,

    type: "success",

    message: ""

  });

  // ============================================
  // SHOW NOTIFICATION
  // ============================================

  const showNotification =
    (type, message) => {

      setNotification({

        show: true,

        type,

        message

      });

      setTimeout(() => {

        setNotification({

          show: false,

          type: "",

          message: ""

        });

      }, 2500);

    };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout =
    () => {

      localStorage.clear();

      showNotification(

        "success",

        "Logged out successfully"

      );

      setTimeout(() => {

        navigate("/");

        window.location.reload();

      }, 1000);

    };

  // ============================================
  // SIDEBAR MENU
  // ============================================

  const menuItems = [

    {

      key: "home",

      label: "Home",

      icon: Home

    },

    {

      key: "buses",

      label: "Bus Management",

      icon: Bus

    },

    {

      key: "trips",

      label: "Trip Management",

      icon: Route

    },

    {
  key: "bookings",
  label: "Bookings",
  icon: Ticket
},
{
  key: "cancelled-bookings",
  label: "Cancelled Bookings",
  icon: Ban
}

  ];

  return (

    <div className="

      min-h-screen

      bg-black

      text-white

    ">

      {/* NOTIFICATION */}

      <Notification

        show={notification.show}

        type={notification.type}

        message={notification.message}

        onClose={() =>

          setNotification({

            ...notification,

            show: false

          })

        }

      />

      {/* SIDEBAR */}

      <Sidebar

        sidebarOpen={sidebarOpen}

        setSidebarOpen={setSidebarOpen}

        title="Smart Bus"

        subtitle="Operator Panel"

        menuItems={menuItems}

        activeSection={activeSection}

        setActiveSection={setActiveSection}

        handleLogout={handleLogout}

      />

      {/* TOPBAR */}

      <div className="

        sticky
        top-0

        z-30

        bg-black

        border-b
        border-zinc-800

      ">

        <div className="

          flex
          items-center
          justify-between

          px-7
          py-5

        ">

          {/* LEFT */}

          <div className="

            flex
            items-center
            gap-5

          ">

            {/* MENU */}

            <button

              onClick={() =>
                setSidebarOpen(true)
              }

              className="

                text-white

                hover:text-red-500

                transition-all
                duration-300

              "

            >

              <Menu size={32} />

            </button>

            {/* TITLE */}

            <div>

              <h1 className="

                text-[34px]
                font-black

                text-red-500

                leading-none

              ">

                Smart Bus

              </h1>

              <p className="

                text-zinc-400

                text-[15px]

                mt-1

              ">

                Operator Panel

              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div className="text-right">

            {/* USER NAME */}

            <h2 className="

              text-lg
              font-semibold

              text-white

            ">

              {

                user?.full_name ||

                user?.company_name ||

                "User"

              }

            </h2>

            {/* ROLE */}

            <p className="

              text-zinc-400
              text-sm

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

                : "Operator"

              }

            </p>

          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="p-8">

        {/* HOME */}

        {

          activeSection === "home"

          && (

            <div className="

              grid

              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3

              gap-6

            ">

              {/* BUS CARD */}

             <DashboardCard

                icon={Bus}

                title="Bus Management"

                description="Manage all buses"

                onClick={() =>

                  setActiveSection(
                    "buses"
                  )

                }

              />

              {/* TRIP CARD */}

              <DashboardCard

                icon={Route}

                title="Trip Management"

                description="Manage trips"

                onClick={() =>

                  setActiveSection(
                    "trips"
                  )

                }

              />

              <DashboardCard

                  icon={Ticket}

                  title="Bookings"

                  description="View trip bookings"

                  onClick={() =>
                    setActiveSection(
                      "bookings"
                    )
                  }

                />

                <DashboardCard

                  icon={Ban}

                  title="Cancelled Bookings"

                  description="View cancelled tickets"

                  onClick={() =>
                    setActiveSection(
                      "cancelled-bookings"
                    )
                  }

                />

            </div>

          )

        }

        {/* BUS MANAGEMENT */}

        {

          activeSection === "buses"

          && <BusManagement />

        }

        {/* TRIP MANAGEMENT */}

        {

          activeSection === "trips"

          && <TripManagement />

        }

        {
          activeSection === "bookings"
          && <Bookings />
        }

        {
          activeSection === "cancelled-bookings"
          && <CancelledBookings />
        }

      </div>

    </div>

  );

}

export default OperatorDashboard;