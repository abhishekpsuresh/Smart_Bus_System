import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import {
  Plus,
  Pencil,
  Trash2
} from "lucide-react";

import CustomDropdown from "../../components/CustomDropdown";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import Notification from "../../components/Notification";

function BusManagement() {

  // ============================================
  // USER
  // ============================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // ============================================
  // TOKEN
  // ============================================

  const token =
    localStorage.getItem("token");

  // ============================================
  // STATES
  // ============================================

  const [
    buses,
    setBuses
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    showModal,
    setShowModal
  ] = useState(false);

  const [
    editingBus,
    setEditingBus
  ] = useState(null);

  const [
  submitLoading,
  setSubmitLoading
] = useState(false);

const [
  busImages,
  setBusImages
] = useState([]);

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
  // FORM DATA
  // ============================================

  const [
    busData,
    setBusData
  ] = useState({

    bus_name: "",

    bus_number: "",

    bus_type: "",

    bus_body_type: "",

    total_seats: "",

    manufacture_year: ""

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
  // FETCH BUSES
  // ============================================

  const fetchBuses =
    useCallback(

      async () => {

        try {

          setLoading(true);

          const response =
            await axios.get(

              "http://localhost:5000/api/buses",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`

                }

              }

            );

          setBuses(

            Array.isArray(
              response.data?.buses
            )

            ? response.data.buses

            : []

          );

        }

        catch (error) {

          console.log(error);

          setBuses([]);

          showNotification(

            "error",

            "Failed to load buses"

          );

        }

        finally {

          setLoading(false);

        }

      },

      [token]

    );

  // ============================================
  // LOAD
  // ============================================

  useEffect(() => {

    const loadData =
      async () => {

        await fetchBuses();

      };

    loadData();

  }, [fetchBuses]);

  // ============================================
  // RESET FORM
  // ============================================

  const resetForm =
    () => {

      setBusData({

        bus_name: "",

        bus_number: "",

        bus_type: "",

        bus_body_type: "",

        total_seats: "",

        manufacture_year: ""

      });

      setBusImages([]);

      setEditingBus(null);

    };

  // ============================================
  // OPEN MODAL
  // ============================================

  const openAddModal =
    () => {

      resetForm();

      setShowModal(true);

    };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const closeModal =
    () => {

      setShowModal(false);

      resetForm();

    };

  // ============================================
  // HANDLE INPUT
  // ============================================

  const handleChange =
    (e) => {

      setBusData({

        ...busData,

        [e.target.name]:
          e.target.value

      });

    };

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setSubmitLoading(true);

        // ======================================
        // UPDATE
        // ======================================

        if (editingBus) {

          await axios.put(

            `http://localhost:5000/api/buses/${editingBus.id}`,

            busData,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

          showNotification(

            "success",

            "Bus updated successfully"

          );

        }

        if (busImages.length > 0) {

  const imageFormData =
    new FormData();

  busImages.forEach((image) => {

    imageFormData.append(
      "images",
      image
    );

  });

  await axios.post(

    `http://localhost:5000/api/buses/${editingBus.id}/images`,

    imageFormData,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
        "multipart/form-data"
      }
    }

  );

}

        // ======================================
        // ADD
        // ======================================

        else {

          const response = await axios.post(
  "http://localhost:5000/api/buses",
  {
    ...busData,
    operator_id: user?.id
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

if (busImages.length > 0) {

  const imageFormData =
    new FormData();

  busImages.forEach((image) => {

    imageFormData.append(
      "images",
      image
    );

  });

  await axios.post(

    `http://localhost:5000/api/buses/${response.data.busId}/images`,

    imageFormData,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
        "multipart/form-data"
      }
    }

  );

}

          showNotification(

            "success",

            "Bus added successfully"

          );

        }

        fetchBuses();

        closeModal();

      }

      catch (error) {

        console.log(error);

        console.log(error.response);

        showNotification(

          "error",

          error.response?.data
            ?.message ||

          "Operation failed"

        );

      }

      finally {

        setSubmitLoading(false);

      }

    };

  // ============================================
  // EDIT
  // ============================================

  const handleEdit =
    (bus) => {

      setEditingBus(bus);

      setBusData({

        bus_name:
          bus.bus_name || "",

        bus_number:
          bus.bus_number || "",

        bus_type:
          bus.bus_type || "",

        bus_body_type:
          bus.bus_body_type || "",

        total_seats:
          bus.total_seats || "",

        manufacture_year:
          bus.manufacture_year || ""

      });

      setShowModal(true);

    };

  // ============================================
  // DELETE
  // ============================================

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this bus?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(

          `http://localhost:5000/api/buses/${id}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        showNotification(

          "success",

          "Bus deleted successfully"

        );

        fetchBuses();

      }

      catch (error) {

        console.log(error);

        showNotification(

          "error",

          "Delete failed"

        );

      }

    };

  // ============================================
  // FORMAT DATE
  // ============================================

const formatDate = (date) => {

  if (!date) return "-";

  const formattedDate =
    new Date(date);

  const onlyDate =
    formattedDate.toLocaleDateString();

  const onlyTime =
    formattedDate.toLocaleTimeString();

  return (

    <div className="leading-7">

      <div>
        {onlyDate}
      </div>

      <div className="text-zinc-400">

        {onlyTime}

      </div>

    </div>

  );

};

  // ============================================
  // TABLE COLUMNS
  // ============================================

  const columns = [

    "Bus Name",

    "Bus Number",

    "Type",

    "Body Type",

    "Seats",

    "Manufacture Year",

    "Added At",

    "Updated At",

    "Actions"

  ];

  return (

    <div className="w-full">

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

      {/* CONTENT */}

      <div className="px-8 py-10">

        {/* HEADER */}

        <div className="

          flex
          items-start
          justify-between

          mb-10

        ">

          <div>

            <h1 className="

              text-5xl
              font-bold

              text-white

            ">

              Bus Management

            </h1>

            <p className="

              text-zinc-400

              mt-3
              text-lg

            ">

              Manage operator buses

            </p>

          </div>

          {/* ADD BUTTON */}

          <button

            onClick={openAddModal}

            className="

              bg-red-500
              hover:bg-red-600

              transition-all
              duration-300

              px-8 py-5

              rounded-3xl

              flex
              items-center
              gap-3

              font-semibold
              text-lg

            "

          >

            <Plus size={22} />

            Add Bus

          </button>

        </div>

        {/* TABLE */}

        <DataTable

          columns={columns}

          data={

            Array.isArray(buses)

            ? buses

            : []

          }

          loading={loading}

          emptyMessage="No buses added yet"

          renderRow={(bus = {}) => (

            <tr

              key={bus.id}

              className="

                border-b
                border-zinc-800

                hover:bg-zinc-800/40

                transition-all
                duration-300

              "

            >

              <td className="p-6">

                {bus.bus_name || "-"}

              </td>

              <td className="p-6">

                {bus.bus_number || "-"}

              </td>

              <td className="p-6">

                {bus.bus_type || "-"}

              </td>

              <td className="p-6">

                {bus.bus_body_type || "-"}

              </td>

              <td className="p-6">

                {bus.total_seats || "-"}

              </td>

              <td className="p-6">

                {bus.manufacture_year || "-"}

              </td>

              <td className="

                p-6

                text-zinc-400
                text-sm

              ">

                {

                  formatDate(
                    bus.created_at
                  )

                }

              </td>

              <td className="

                p-6

                text-zinc-400
                text-sm

              ">

                {

                  formatDate(
                    bus.updated_at
                  )

                }

              </td>

              {/* ACTIONS */}

              <td className="p-6">

                <div className="

                  flex
                  justify-center
                  gap-3

                ">

                  {/* EDIT */}

                  <button

                    onClick={() =>
                      handleEdit(bus)
                    }

                    className="

                      p-3

                      rounded-2xl

                      bg-blue-500
                      hover:bg-blue-600

                      transition-all
                      duration-300

                    "

                  >

                    <Pencil size={18} />

                  </button>

                  {/* DELETE */}

                  <button

                    onClick={() =>
                      handleDelete(bus.id)
                    }

                    className="

                      p-3

                      rounded-2xl

                      bg-red-500
                      hover:bg-red-600

                      transition-all
                      duration-300

                    "

                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </td>

            </tr>

          )}

        />

      </div>

      {/* MODAL */}

      <Modal

        isOpen={showModal}

        onClose={closeModal}

        title={

          editingBus

            ? "Edit Bus"

            : "Add Bus"

        }

        maxWidth="max-w-xl"

      >

        {/* FORM */}

        <form

          onSubmit={handleSubmit}

          className="space-y-5"

        >

          {/* BUS NAME */}

          <FormInput

            type="text"

            name="bus_name"

            placeholder="Bus Name"

            value={busData.bus_name}

            onChange={handleChange}

            required

          />

          {/* BUS NUMBER */}

          <FormInput

            type="text"

            name="bus_number"

            placeholder="Bus Number"

            value={busData.bus_number}

            onChange={handleChange}

            required

          />

          {/* BUS TYPE */}

          <CustomDropdown

            options={[

              "AC Sleeper",

              "Non-AC Sleeper",

              "Semi Sleeper",

              "Luxury Sleeper"

            ]}

            value={busData.bus_type}

            onChange={(value) =>

              setBusData({

                ...busData,

                bus_type: value

              })

            }

            placeholder="Select Bus Type"

          />

          {/* BUS BRAND */}

          <CustomDropdown

            options={[

              "Volvo",

              "Scania",

              "BharathBenz",

              "Ashok Leyland"

            ]}

            value={busData.bus_body_type}

            onChange={(value) =>

              setBusData({

                ...busData,

                bus_body_type: value

              })

            }

            placeholder="Select Bus Brand"

          />

          {/* TOTAL SEATS */}

          {
  !editingBus && (

    <CustomDropdown

      options={[
        "30",
        "36",
        "42"
      ]}

      value={String(
        busData.total_seats
      )}

      onChange={(value) =>

        setBusData({

          ...busData,

          total_seats: value

        })

      }

      placeholder="Select Total Seats"

    />

  )
}

          {/* MANUFACTURE YEAR */}

          <FormInput

            type="number"

            name="manufacture_year"

            placeholder="Manufacture Year"

            value={busData.manufacture_year}

            onChange={handleChange}

            required

          />

          {/* BUS IMAGES */}

<div>

  <label className="block text-zinc-400 mb-2">

    Add Bus Images

  </label>

  <input

  type="file"

  multiple

  accept="image/*"

  onChange={(e) =>
    setBusImages(
      Array.from(
        e.target.files
      )
    )
  }

  className="
    w-full
    bg-zinc-900
    border
    border-zinc-700
    rounded-xl
    p-3
  "

/>

</div>

          {/* BUTTON */}

          <button

            type="submit"

            disabled={submitLoading}

            className="

              w-full
              h-16

              rounded-[22px]

              bg-red-500
              hover:bg-red-600

              transition-all
              duration-300

              font-black
              text-[20px]

              mt-4

            "

          >

            {

              submitLoading

                ? "Please wait..."

                : editingBus

                ? "Update Bus"

                : "Add Bus"

            }

          </button>

        </form>

      </Modal>

    </div>

  );

}

export default BusManagement;