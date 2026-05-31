import { useEffect, useState } from "react";
import axios from "axios";

function UserManagement() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    await loadUsers();
  };

  fetchData();
}, []);

  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold text-red-500 mb-10">
        User Monitoring
      </h1>

      <div className="space-y-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold text-red-500">
                  {user.full_name}
                </h2>

                <p className="text-zinc-400 mt-1">
                  {user.email}
                </p>
              </div>

             <span
  className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${
    user.role === "admin"
      ? "bg-red-500 text-red-100 border border-red-500/30"
      : user.role === "operator"
      ? "bg-green-500 text-green-100 border border-green-500/30"
      : "bg-blue-500 text-blue-100 border border-blue-500/30"
  }`}
>
  {user.role}
</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-zinc-500 text-sm">Phone</p>
                <p className="text-white">{user.phone}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Email</p>
                <p className="text-white">{user.email}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">User ID</p>
                <p className="text-white">{user.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserManagement;