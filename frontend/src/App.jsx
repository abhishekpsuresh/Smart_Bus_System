import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MyBookings
from "./pages/user/MyBookings";

// AUTH

import AuthPage from "./pages/auth/AuthPage";

// USER

import UserDashboard from "./pages/user/UserDashboard";

import SearchTrips from "./pages/user/SearchTrips";

import SeatSelection from "./pages/user/SeatSelection";

import PaymentPage from "./pages/user/PaymentPage";

// OPERATOR

import OperatorDashboard from "./pages/operator/OperatorDashboard";

import BusManagement from "./pages/operator/BusManagement";

import TripManagement from "./pages/operator/TripManagement";

// ADMIN

import AdminDashboard from "./pages/admin/AdminDashboard";

import Bookings from "./pages/admin/Bookings";
import CancelledBookings from "./pages/admin/CancelledBookings";

// TOAST

import {
  ToastContainer
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// STYLES

import "./App.css";

function App() {

  const token =
    localStorage.getItem("token");

  let user = null;

  try {

    user = JSON.parse(
      localStorage.getItem("user")
    );

  }

  catch {

    console.log(
      "Invalid user data"
    );

    localStorage.clear();

  }

  return (

    <BrowserRouter>

      {/* TOAST */}

      <ToastContainer

        position="top-center"

        autoClose={2000}

        theme="dark"

      />

      <Routes>

        {/* HOME / AUTH */}

        <Route

          path="/"

          element={

            !token

              ? (
                <AuthPage />
              )

              : user?.role === "admin"

                ? (
                  <Navigate
                    to="/admin/dashboard"
                    replace
                  />
                )

                : user?.role === "operator"

                  ? (
                    <Navigate
                      to="/operator/dashboard"
                      replace
                    />
                  )

                  : (
                    <Navigate
                      to="/user/dashboard"
                      replace
                    />
                  )

          }

        />

        {/* USER DASHBOARD */}

        <Route

          path="/user/dashboard"

          element={

            token &&
            user?.role === "user"

              ? (
                <UserDashboard />
              )

              : (
                <Navigate
                  to="/"
                  replace
                />
              )

          }

        />

        {/* SEARCH TRIPS */}

        <Route

          path="/search-trips"

          element={

            <SearchTrips />

          }

        />

        {/* SEAT SELECTION */}

        <Route

          path="/seat-selection/:trip_id"

          element={

            <SeatSelection />

          }

        />

        {/* PAYMENT PAGE */}

        <Route

          path="/payment"

          element={

            <PaymentPage />

          }

        />

        <Route
  path="/my-bookings"
  element={<MyBookings />}
/>

        {/* OPERATOR DASHBOARD */}

        <Route

          path="/operator/dashboard"

          element={

            token &&
            user?.role === "operator"

              ? (
                <OperatorDashboard />
              )

              : (
                <Navigate
                  to="/"
                  replace
                />
              )

          }

        />

        {/* BUS MANAGEMENT */}

        <Route

          path="/operator/bus-management"

          element={

            token &&
            user?.role === "operator"

              ? (
                <BusManagement />
              )

              : (
                <Navigate
                  to="/"
                  replace
                />
              )

          }

        />

        {/* TRIP MANAGEMENT */}

        <Route

          path="/operator/trip-management"

          element={

            token &&
            user?.role === "operator"

              ? (
                <TripManagement />
              )

              : (
                <Navigate
                  to="/"
                  replace
                />
              )

          }

        />

        {/* ADMIN DASHBOARD */}

        <Route

          path="/admin/dashboard"

          element={

            token &&
            user?.role === "admin"

              ? (
                <AdminDashboard />
              )

              : (
                <Navigate
                  to="/"
                  replace
                />
              )

          }

        />

        <Route
  path="/admin/bookings"
  element={<Bookings />}
/>

<Route
  path="/admin/cancelled-bookings"
  element={<CancelledBookings />}
/>

        {/* UNKNOWN ROUTES */}

        <Route

          path="*"

          element={

            <Navigate
              to="/"
              replace
            />

          }

        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;