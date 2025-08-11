import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  LogOut,
  Settings,
  User,
  HelpCircle,
  LayoutDashboard,
  History,
} from "lucide-react";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    city: "",
    state: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => {
        const { name, email, contact, city, state, address } = res.data.user;
        setForm({ name, email, password: "", contact, city, state, address });
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/profile", form);
      setMessage("✅ Profile updated!");
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Failed to update profile.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-blue-600">
            Vendor Panel
          </h2>
          <nav className="space-y-4">
            <a
              href="/profile"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium"
            >
              <User size={18} /> Profile
            </a>
            <a
              href="/vendor/orders/history"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium"
            >
              <History size={18} /> Order History
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Settings size={18} /> Settings
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium"
            >
              <HelpCircle size={18} /> Support
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium"
            >
              <LayoutDashboard size={18} /> Dashboard
            </a>
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mt-10"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          👋 Welcome back, <span className="text-blue-600">{form.name}</span>
        </h1>

        {message && (
          <p className="mb-4 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded">
            {message}
          </p>
        )}

        <div className="bg-white shadow-md rounded-lg max-w-xl p-8">
          {!editing ? (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  <p className="font-medium text-lg">{form.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email Address</p>
                  <p className="font-medium text-lg">{form.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Contact</p>
                  <p className="font-medium text-lg">{form.contact}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">City</p>
                  <p className="font-medium text-lg">{form.city}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">State</p>
                  <p className="font-medium text-lg">{form.state}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Address</p>
                  <p className="font-medium text-lg">{form.address}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition"
              >
                ✏️ Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium"
                >
                  ✅ Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
