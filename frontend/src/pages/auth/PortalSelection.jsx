function PortalSelection() {

  return (

    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">

      <h1 className="text-5xl font-bold text-red-500 mb-12">

        Smart Bus Booking System

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">

        {/* USER PORTAL */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-red-500 transition">

          <h2 className="text-3xl font-bold mb-4 text-red-400">

            User Portal

          </h2>

          <p className="text-zinc-400 mb-6">

            Book bus tickets and manage your journeys.

          </p>

          <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold">

            Continue

          </button>

        </div>

        {/* OPERATOR PORTAL */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-yellow-500 transition">

          <h2 className="text-3xl font-bold mb-4 text-yellow-400">

            Operator Portal

          </h2>

          <p className="text-zinc-400 mb-6">

            Manage buses, trips and passenger bookings.

          </p>

          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-semibold">

            Continue

          </button>

        </div>

        {/* ADMIN PORTAL */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-500 transition">

          <h2 className="text-3xl font-bold mb-4 text-blue-400">

            Admin Portal

          </h2>

          <p className="text-zinc-400 mb-6">

            Full system monitoring and management access.

          </p>

          <button className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold">

            Continue

          </button>

        </div>

      </div>

    </div>

  );

}

export default PortalSelection;