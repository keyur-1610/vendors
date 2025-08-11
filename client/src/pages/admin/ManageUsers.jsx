import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Trash2 } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("❌ Failed to fetch users:", err));
  }, []);

  const filteredUsers = users.filter((user) => user.role !== "admin");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("✅ User removed successfully.");
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
      alert("❌ Failed to delete user.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F9FAFB]">
      <h1 className="text-3xl font-bold text-[#4D7111] mb-8">
        👥 Manage Users
      </h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-[#91EAAF] text-[#1F4B2C] text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b transition duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F4FFFC]"
                } hover:bg-[#ebfaef]`}
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {user.id}
                </td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize text-green-600 font-medium">
                  {user.role}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="inline-flex items-center bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
