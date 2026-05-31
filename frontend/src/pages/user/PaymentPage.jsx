import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import axios from "axios";

import ReservationTimer
from "../../components/ReservationTimer";

import "./PaymentPage.css";

function PaymentPage() {

  /*
  =========================================
  NAVIGATION
  =========================================
  */

  const location =
    useLocation();

  const navigate =
    useNavigate();

  /*
  =========================================
  GET STATE
  =========================================
  */

  const {

    reservation_request_id,
    total_amount,
    selectedSeats,
    passengers,
    trip,
    reservationStartTime

  } = location.state || {};

  /*
  =========================================
  STATES
  =========================================
  */

  const [
    paymentMethod,
    setPaymentMethod
  ] = useState("UPI");

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    ,
    setPaymentId
  ] = useState(null);

  /*
  =========================================
  VALIDATE ACCESS
  =========================================
  */

  useEffect(() => {

    if (

      !reservation_request_id

    ) {

      navigate(
        "/user/dashboard"
      );

    }

  }, [

    reservation_request_id,
    navigate

  ]);

  /*
  =========================================
  CREATE PAYMENT
  =========================================
  */

  const createPayment =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.post(

            "http://localhost:5000/api/payments/create",

            {

              reservation_request_id,

              payment_method:
                paymentMethod

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        console.log(
          response.data
        );

        setPaymentId(

          response.data
            .payment_id

        );

        return response.data
          .payment_id;

      }

      catch (error) {

        console.log(error);

        alert(
          "Payment creation failed"
        );

        return null;

      }

      finally {

        setLoading(false);

      }

    };

  /*
  =========================================
  VERIFY PAYMENT
  =========================================
  */

  const verifyPayment =
    async (

      createdPaymentId

    ) => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.post(

            "http://localhost:5000/api/payments/verify",

            {

              payment_id:
                createdPaymentId,

              payment_success:
                true

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        console.log(
          response.data
        );

        alert(
          "Payment Successful"
        );

        navigate(
          "/user/dashboard"
        );

      }

      catch (error) {

        console.log(error);

        alert(
          "Payment verification failed"
        );

      }

      finally {

        setLoading(false);

      }

    };

  /*
  =========================================
  HANDLE PAYMENT
  =========================================
  */

  const handlePayment =
    async () => {

      const createdPaymentId =
        await createPayment();

      if (

        !createdPaymentId

      ) {

        return;

      }

      setTimeout(() => {

        verifyPayment(
          createdPaymentId
        );

      }, 2000);

    };

  /*
  =========================================
  REMAINING TIME
  =========================================
  */

 const [remainingSeconds] =
  useState(() => {

    if (!reservationStartTime)
      return 600;

    return Math.max(
      0,
      600 -
        Math.floor(
          (
            Date.now() -
            reservationStartTime
          ) / 1000
        )
    );

  });

  return (

    <div className="payment-page">

      <div className="payment-container">

        {/* HEADER */}

        <div className="payment-header">

          <h1>
            Complete Payment
          </h1>

          <p>
            Confirm your booking
          </p>

        </div>

        {/* TIMER */}

        <ReservationTimer

          initialSeconds={
            remainingSeconds
          }

          onExpire={() => {

            alert(
              "Reservation Expired"
            );

            navigate(
              "/user/dashboard"
            );

          }}

        />

        {/* TRIP DETAILS */}

        <div className="payment-card">

          <h2>
            Trip Details
          </h2>

          <div className="payment-row">

            <span>
              From
            </span>

            <strong>
              {trip?.source_city}
            </strong>

          </div>

          <div className="payment-row">

            <span>
              To
            </span>

            <strong>
              {trip?.destination_city}
            </strong>

          </div>

          <div className="payment-row">

            <span>
              Seats
            </span>

            <strong>

              {

                selectedSeats
                  ?.map(

                    (seat) =>

                      seat.seat_number

                  )

                  .join(", ")

              }

            </strong>

          </div>

        </div>

        {/* PASSENGERS */}

        <div className="payment-card">

          <h2>
            Passenger Details
          </h2>

          {

            passengers?.map(

              (

                passenger,
                index

              ) => (

                <div

                  key={index}

                  className="passenger-item"

                >

                  <div>

                    <strong>

                      {

                        passenger
                          .passenger_name

                      }

                    </strong>

                  </div>

                  <div>

                    {

                      passenger
                        .passenger_gender

                    }

                    {" | "}

                    {

                      passenger
                        .passenger_age

                    }

                    {" yrs"}

                  </div>

                </div>

              )

            )

          }

        </div>

        {/* PAYMENT METHOD */}

        <div className="payment-card">

          <h2>
            Payment Method
          </h2>

          <select

            value={
              paymentMethod
            }

            onChange={(e) =>

              setPaymentMethod(
                e.target.value
              )

            }

            className="payment-select"

          >

            <option value="UPI">
              UPI
            </option>

            <option value="Card">
              Card
            </option>

            <option value="NetBanking">
              Net Banking
            </option>

            <option value="Wallet">
              Wallet
            </option>

          </select>

        </div>

        {/* TOTAL */}

        <div className="payment-total">

          <span>
            Total Amount
          </span>

          <strong>
            ₹{total_amount}
          </strong>

        </div>

        {/* PAY */}

        <button

          onClick={
            handlePayment
          }

          disabled={
            loading
          }

          className="pay-button"

        >

          {

            loading

              ? "Processing..."

              : `Pay ₹${total_amount}`

          }

        </button>

      </div>

    </div>

  );

}

export default PaymentPage;