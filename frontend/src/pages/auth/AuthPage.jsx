import toast from "react-hot-toast";

import { useState } from "react";

import axios from "axios";

import {
  motion,
  AnimatePresence,
  LayoutGroup
} from "framer-motion";

function AuthPage() {

  const [authMode, setAuthMode] =
    useState("login");

  const [role, setRole] =
    useState("user");

  const [signupData, setSignupData] =
    useState({

      full_name: "",

      email: "",

      phone: "",

      password: ""

    });

  // ULTRA SMOOTH SPRING

  const smoothSpring = {

    type: "spring",

    stiffness: 75,

    damping: 16,

    mass: 0.85

  };

  // FORM SUBMIT

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      // USER SIGNUP

      if (

        authMode === "signup" &&

        role === "user"

      ) {

        const response =
        await axios.post(

          "http://localhost:5000/api/auth/register",

          signupData

        );

        toast.success(response.data.message);

      }

      // OPERATOR REQUEST

      else if (

        authMode === "signup" &&

        role === "operator"

      ) {

        const response =
        await axios.post(

          "http://localhost:5000/api/operator-requests",

          signupData

        );

        toast.success(
          response.data.message
        );

      }

      // LOGIN

      else if (
        authMode === "login"
      ) {

        const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

if (
  authMode === "signup" &&
  !passwordRegex.test(signupData.password)
) {

  toast.error(
    "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long"
  );

  return;

}

        const response =
await axios.post(
  "http://localhost:5000/api/auth/login",
  {
    email: signupData.email,
    password: signupData.password,
    role: role
  }
);

        // STORE TOKEN

        localStorage.setItem(

          "token",

          response.data.token

        );

        localStorage.setItem(

          "user",

          JSON.stringify(
            response.data.user
          )

        );

        // ROLE BASED REDIRECT

        toast.success(
          "Logged in successfully"
        );

        setTimeout(() => {

          if (

            response.data.user.role
            === "admin"

          ) {

            window.location.href =
            "/admin/dashboard";

          }

          else if (

            response.data.user.role
            === "operator"

          ) {

            window.location.href =
            "/operator/dashboard";

          }

          else {

            window.location.href =
            "/user/dashboard";

          }

        }, 1200);

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data
        ?.message ||

        "Something went wrong"

      );

    }

  };

  return (

    <div className="min-h-screen bg-black text-white flex overflow-hidden">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex w-1/2 flex-col justify-center px-20">

        <motion.div

          initial={{
            opacity: 0,
            x: -25
          }}

          animate={{
            opacity: 1,
            x: 0
          }}

          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }}

        >

          <h1 className="text-4xl font-bold text-red-500 leading-tight">

            Smart Bus
            <br />
            Booking System

          </h1>

          <p className="text-zinc-400 mt-6 text-base max-w-lg leading-8">

            Fast, secure and smart online bus ticket booking platform with real-time seat management.

          </p>

        </motion.div>

      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <LayoutGroup>

          <motion.div

            layout

            transition={{
              layout: smoothSpring
            }}

            className="w-full max-w-sm bg-white/5 backdrop-blur-lg border border-zinc-800 rounded-3xl px-6 py-7 shadow-2xl"
          >

            {/* LOGIN / SIGNUP */}

            <motion.div

              layout

              transition={{
                layout: smoothSpring
              }}

              className="relative flex justify-end bg-zinc-900 rounded-2xl p-1 mb-8 overflow-hidden w-fit ml-auto"
            >

              {/* ACTIVE TAB */}

              <motion.div

                layoutId="authTab"

                transition={smoothSpring}

                className={`absolute top-1 bottom-1 w-1/2 rounded-xl bg-red-500 ${
                  authMode === "login"
                    ? "left-1"
                    : "left-1/2"
                }`}
              />

              <button

                onClick={() => {

                  setAuthMode("login");

                  setRole("user");

                }}

                className="relative z-10 px-6 py-2 font-semibold"
              >

                Login

              </button>

              <button

                onClick={() => {

                  setAuthMode("signup");

                  setRole("user");

                }}

                className="relative z-10 px-6 py-2 font-semibold"
              >

                Signup

              </button>

            </motion.div>

            {/* ROLE SWITCH */}

            <motion.div

              layout

              transition={{
                layout: smoothSpring
              }}

              className="relative flex bg-zinc-900 rounded-2xl p-1 mb-8 overflow-hidden"
            >

              {/* ACTIVE ROLE */}

              <motion.div

                layoutId="roleTab"

                transition={smoothSpring}

                className={`absolute top-1 bottom-1 rounded-xl bg-red-500 z-0 ${
                  authMode === "signup"
                    ? role === "user"
                      ? "left-1 w-[calc(50%-4px)]"
                      : "left-1/2 w-[calc(50%-4px)]"
                    : role === "user"
                    ? "left-1 w-[calc(33.33%-4px)]"
                    : role === "operator"
                    ? "left-1/3 w-[calc(33.33%-4px)]"
                    : "left-2/3 w-[calc(33.33%-4px)]"
                }`}
              />

              {authMode === "login" ? (
                <>
                  {["user", "operator", "admin"]
                    .map((item) => (

                    <button

                      key={item}

                      onClick={() =>
                        setRole(item)
                      }

                      className="relative z-10 flex-1 py-2.5 font-semibold capitalize"
                    >

                      {item}

                    </button>

                  ))}
                </>
              ) : (
                <>
                  {["user", "operator"]
                    .map((item) => (

                    <button

                      key={item}

                      onClick={() =>
                        setRole(item)
                      }

                      className="relative z-10 flex-1 py-2.5 font-semibold capitalize"
                    >

                      {item}

                    </button>

                  ))}
                </>
              )}

            </motion.div>

            {/* TITLE */}

            <div className="mb-6 min-h-[42px] overflow-hidden">

              <AnimatePresence mode="wait">

                <motion.h2

                  key={`${authMode}-${role}-title`}

                  initial={{
                    opacity: 0,
                    y: 10
                  }}

                  animate={{
                    opacity: 1,
                    y: 0
                  }}

                  exit={{
                    opacity: 0,
                    y: -10
                  }}

                  transition={{
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1]
                  }}

                  className="text-2xl font-bold capitalize"
                >

                  {authMode === "login"
                    ? `${role} Login`
                    : role === "operator"
                    ? "Operator Request"
                    : "User Sign Up"}

                </motion.h2>

              </AnimatePresence>

            </div>

            {/* FORM */}

            <AnimatePresence
              mode="wait"
              initial={false}
            >

              <motion.form

                layout

                onSubmit={handleSubmit}

                key={`${authMode}-${role}`}

                initial={{
                  opacity: 0,
                  y: 14
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                exit={{
                  opacity: 0,
                  y: -14
                }}

                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1]
                }}

                className="space-y-5"
              >

                {authMode === "signup" ? (
                  <>

                    <motion.input
                      layout
                      transition={smoothSpring}
                      type="text"
                      placeholder={
                        role === "operator"
                          ? "Bus / Company Name"
                          : "Full Name"
                      }
                      value={signupData.full_name}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          full_name:
                          e.target.value
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all duration-500"
                    />

                    <motion.input
                      layout
                      transition={smoothSpring}
                      type="email"
                      placeholder="Email Address"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email:
                          e.target.value
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all duration-500"
                    />

                    <motion.input
                      layout
                      transition={smoothSpring}
                      type="text"
                      placeholder="Contact Number"
                      value={signupData.phone}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          phone:
                          e.target.value
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all duration-500"
                    />

                    <motion.input
                      layout
                      transition={smoothSpring}
                      type="password"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password:
                          e.target.value
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all duration-500"
                    />

                    <motion.button
                      type="submit"
                      layout
                      transition={smoothSpring}
                      whileTap={{
                        scale: 0.985
                      }}
                      whileHover={{
                        scale: 1.01
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition-all duration-500"
                    >

                      {role === "operator"
                        ? "Send Request"
                        : "Create Account"}

                    </motion.button>

                  </>
                ) : (
                  <>

                    <motion.input
                      layout
                      transition={smoothSpring}
                      type="email"
                      placeholder="Email Address"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email:
                          e.target.value
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all duration-500"
                    />

                    <motion.input
                      layout
                      transition={smoothSpring}
                      type="password"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password:
                          e.target.value
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all duration-500"
                    />

                    <motion.button
                      type="submit"
                      layout
                      transition={smoothSpring}
                      whileTap={{
                        scale: 0.985
                      }}
                      whileHover={{
                        scale: 1.01
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition-all duration-500"
                    >

                      Login

                    </motion.button>

                  </>
                )}

              </motion.form>

            </AnimatePresence>

          </motion.div>

        </LayoutGroup>

      </div>

    </div>

  );

}

export default AuthPage;