import {

  useState,
  useEffect

} from "react";

import {
  Home,
  Search,
  Ticket,
  Ban
} from "lucide-react";

import {

  useNavigate

} from "react-router-dom";

import {

  toast

} from "react-hot-toast";

import Navbar
from "../../components/Navbar";

import Sidebar
from "../../components/Sidebar";

import DashboardCard
from "../../components/DashboardCard";

import SearchTrips
from "./SearchTrips";

import MyBookings
from "./MyBookings";

import MyCancelledBookings from "./MyCancelledBookings";

function UserDashboard() {

  const navigate =
    useNavigate();

  /*
  ===================================
  USER
  ===================================
  */

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  /*
  ===================================
  STATES
  ===================================
  */

  const [

    sidebarOpen,
    setSidebarOpen

  ] = useState(false);

  const [

    activeSection,
    setActiveSection

  ] = useState("home");

  /*
  ===================================
  AUTH
  ===================================
  */

  useEffect(() => {

    if (!user) {

      navigate("/");

    }

  }, [user, navigate]);

  /*
  ===================================
  LOGOUT
  ===================================
  */

  const handleLogout =
    () => {

      localStorage.clear();

      toast.success(
        "Logged out successfully"
      );

      setTimeout(() => {

        navigate("/");

        window.location.reload();

      }, 1000);

    };

  /*
  ===================================
  MENU
  ===================================
  */

  const menuItems = [

    {

      key: "home",

      label: "Home",

      icon: Home

    },

    {

      key: "search",

      label: "Search Trips",

      icon: Search

    },

    {

      key: "bookings",

      label: "My Bookings",

      icon: Ticket

    },

    {
  key: "cancelled",
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

      {/* SIDEBAR */}

      <Sidebar

        sidebarOpen={sidebarOpen}

        setSidebarOpen={setSidebarOpen}

        title="Smart Bus"

        subtitle="User Panel"

        menuItems={menuItems}

        activeSection={activeSection}

        setActiveSection={setActiveSection}

        handleLogout={handleLogout}

      />

      {/* NAVBAR */}

      <Navbar
  user={user}
  role="User"
  onMenuClick={() =>
    setSidebarOpen(true)
  }
/>
      {/* CONTENT */}

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

              {/* SEARCH */}

              <DashboardCard

                title="Search Trips"

                description="Find available buses"

                icon={Search}

                onClick={() =>

                  setActiveSection("search")

                }

              />

              {/* BOOKINGS */}

              <DashboardCard

                title="My Bookings"

                description="View booked tickets"

                icon={Ticket}

                onClick={() =>

                  setActiveSection("bookings")

                }

              />

              {/*  CANCELLED BOOKINGS */}

              <DashboardCard
                title="Cancelled Bookings"
                description="View cancelled tickets"
                icon={Ban}
                onClick={() =>
                  setActiveSection("cancelled")
                }
              />

            </div>

          )

        }

        {/* SEARCH */}

        {

          activeSection === "search"

          && (

            <SearchTrips />

          )

        }

        {/* BOOKINGS */}

        {/* BOOKINGS */}

{
  activeSection === "bookings"
  && (

    <MyBookings />

  )
}

{
  activeSection === "cancelled"
  && (
    <MyCancelledBookings />
  )
}

      </div>

    </div>

  );

}

export default UserDashboard;