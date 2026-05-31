import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import {
  Menu,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Bus,
  Route,
  Check,
  Trash2,
  Ticket,
  Ban
} from "lucide-react";

import {
  motion
} from "framer-motion";

import Sidebar from "../../components/Sidebar";

import DashboardCard from "../../components/DashboardCard";

import DataTable from "../../components/DataTable";

import Notification from "../../components/Notification";

import UserManagement from "./UserManagement";
import BusMonitoring from "./BusMonitoring";
import TripMonitoring from "./TripMonitoring";

import Bookings from "./Bookings";
import CancelledBookings from "./CancelledBookings";

function AdminDashboard() {

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

  const [
    requests,
    setRequests
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

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
  // FETCH REQUESTS
  // ============================================

  const fetchRequests =
    useCallback(

      async () => {

        try {

          setLoading(true);

          const response =
            await axios.get(

              "http://localhost:5000/api/operator-requests"

            );

          setRequests(
            response.data
          );

        }

        catch (error) {

          console.log(error);

          showNotification(

            "error",

            "Failed to load requests"

          );

        }

        finally {

          setLoading(false);

        }

      },

      []

    );

  // ============================================
  // LOAD DATA
  // ============================================

  useEffect(() => {

    const loadData =
      async () => {

        await fetchRequests();

      };

    loadData();

  }, [fetchRequests]);

  // ============================================
  // APPROVE
  // ============================================

  const handleApprove =
    async (id) => {

      try {

        const response =
          await axios.put(

            `http://localhost:5000/api/operator-requests/approve/${id}`

          );

        showNotification(

          "success",

          response.data.message

        );

        fetchRequests();

      }

      catch (error) {

        console.log(error);

        showNotification(

          "error",

          "Approval failed"

        );

      }

    };

  // ============================================
  // REJECT
  // ============================================

  const handleReject =
    async (id) => {

      try {

        const response =
          await axios.delete(

            `http://localhost:5000/api/operator-requests/${id}`

          );

        showNotification(

          "success",

          response.data.message

        );

        fetchRequests();

      }

      catch (error) {

        console.log(error);

        showNotification(

          "error",

          "Reject failed"

        );

      }

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

        window.location.href = "/";

      }, 1000);

    };

  // ============================================
  // SIDEBAR MENU
  // ============================================

  const menuItems = [

    {

      key: "home",

      label: "Home",

      icon: LayoutDashboard

    },

    {

      key: "operator-requests",

      label: "Operator Requests",

      icon: ShieldCheck

    },
    
    {
  key: "users",
  label: "User Monitoring",
  icon: Users
},
{
  key: "buses",
  label: "Bus Monitoring",
  icon: Bus
},
{
  key: "trips",
  label: "Trip Monitoring",
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
},


  ];

  // ============================================
  // DASHBOARD CARDS
  // ============================================

  const operationCards = [

    {

      id: "operator-requests",

      title:
        "Operator Requests",

      description:
        "Manage operator approvals",

      icon:
        ShieldCheck

    },

    {

      id: "users",

      title:
        "User Monitoring",

      description:
        "Monitor platform users",

      icon:
        Users

    },

    {

      id: "buses",

      title:
        "Bus Monitoring",

      description:
        "Monitor platform buses",

      icon:
        Bus

    },

    {

      id: "trips",

      title:
        "Trip Monitoring",

      description:
        "Monitor active trips",

      icon:
        Route

    },

    {
  id: "bookings",
  title: "Bookings",
  description: "View trip bookings",
  icon: Ticket
},
{
  id: "cancelled-bookings",
  title: "Cancelled Bookings",
  description: "View cancelled tickets",
  icon: Ban
}

  ];

  // ============================================
  // TABLE COLUMNS
  // ============================================

  const columns = [

    "Company Name",

    "Email",

    "Phone",

    "Applied At",

    "Status",

    "Actions"

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

        subtitle="Admin Panel"

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

            <button

              onClick={() =>
                setSidebarOpen(true)
              }

            >

              <Menu size={34} />

            </button>

            <div>

              <h1 className="
  text-4xl
  font-bold
  text-red-500
">
  Smart Bus
</h1>

<p className="
  text-zinc-400
  mt-1
">
  Admin Panel
</p>

            </div>

          </div>

          {/* RIGHT */}

          <div className="text-right">

            <h2 className="

              text-xl
              font-semibold

            ">

              {

                user?.full_name ||

                "Admin"

              }

            </h2>

            <p className="text-zinc-400">

              Admin

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

            <motion.div

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              className="

                grid

                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3

                gap-8

              "

            >

              {

                operationCards.map(
                  (card) => (

                    <DashboardCard

                      key={card.id}

                      icon={card.icon}

                      title={card.title}

                      description={card.description}

                      onClick={() =>

                        setActiveSection(
                          card.id
                        )

                      }

                    />

                  ))

              }

            </motion.div>

          )

        }

        {/* OPERATOR REQUESTS */}

        {

          activeSection ===
          "operator-requests"

          && (

            <motion.div

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

            >

              <h1 className="text-4xl font-bold text-red-500 mb-8">
                Operator Requests
              </h1>

              <DataTable

                columns={columns}

                data={requests}

                loading={loading}

                emptyMessage="No operator requests found"

                renderRow={(request) => (

                  <tr

                    key={request.id}

                    className="

                      border-b
                      border-zinc-800

                      hover:bg-zinc-800/40

                      transition-all
                      duration-300

                    "

                  >

                    {/* COMPANY */}

                    <td className="p-6">

                      {request.full_name}

                    </td>

                    {/* EMAIL */}

                    <td className="

                      p-6

                      text-zinc-300

                    ">

                      {request.email}

                    </td>

                    {/* PHONE */}

                    <td className="

                      p-6

                      text-zinc-300

                    ">

                      {request.phone}

                    </td>

                    {/* DATE */}

                    <td className="

                      p-6

                      text-zinc-400
                      text-sm

                    ">

                      {

                        new Date(
                          request.created_at
                        ).toLocaleString()

                      }

                    </td>

                    {/* STATUS */}

                    <td className="p-6">

                      <span className={`

                        px-4 py-2

                        rounded-xl

                        text-sm
                        font-semibold

                        ${

                          request.status ===
                          "approved"

                          ? "bg-green-500/20 text-green-400"

                          : "bg-yellow-500/20 text-yellow-400"

                        }

                      `}>

                        {request.status}

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="p-6">

                      <div className="

                        flex
                        justify-center
                        gap-3

                      ">

                        {/* APPROVE */}

                        <button

                          disabled={
                            request.status ===
                            "approved"
                          }

                          onClick={() =>
                            handleApprove(
                              request.id
                            )
                          }

                          className={`

                            p-3

                            rounded-2xl

                            transition-all
                            duration-300

                            ${

                              request.status ===
                              "approved"

                              ? "bg-zinc-700 cursor-not-allowed"

                              : "bg-green-500 hover:bg-green-600"

                            }

                          `}

                        >

                          <Check size={18} />

                        </button>

                        {/* REJECT */}

                        <button

                          disabled={
                            request.status ===
                            "approved"
                          }

                          onClick={() =>
                            handleReject(
                              request.id
                            )
                          }

                          className={`

                            p-3

                            rounded-2xl

                            transition-all
                            duration-300

                            ${

                              request.status ===
                              "approved"

                              ? "bg-zinc-700 cursor-not-allowed"

                              : "bg-red-500 hover:bg-red-600"

                            }

                          `}

                        >

                          <Trash2 size={18} />

                        </button>

                      </div>

                    </td>

                  </tr>

                )}

              />

            </motion.div>

          )

        }

        {
  activeSection === "users" && (
    <UserManagement />
  )
}

{
  activeSection === "buses" && (
    <BusMonitoring />
  )
}

{
  activeSection === "trips" && (
    <TripMonitoring />
  )
}

        {
  activeSection === "bookings" && (
    <Bookings />
  )
}

{
  activeSection === "cancelled-bookings" && (
    <CancelledBookings />
  )
}

      </div>

    </div>

  );

}

export default AdminDashboard;