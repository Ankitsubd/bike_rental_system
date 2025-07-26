// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import BikeAdmin from "./BikeAdmin";
import UserAdmin from "./UserAdmin";

export default function AdminDashboard() {
  const [tab, setTab] = useState("bikes");
  return (
    <div className="pt-28 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="flex gap-6 mb-8">
        <button className={`px-5 py-2 rounded-xl ${tab === "bikes" ? "bg-purple-700 text-white" : "bg-white/10 text-white"}`} onClick={() => setTab("bikes")}>Manage Bikes</button>
        <button className={`px-5 py-2 rounded-xl ${tab === "users" ? "bg-purple-700 text-white" : "bg-white/10 text-white"}`} onClick={() => setTab("users")}>Manage Users</button>
      </div>
      {tab === "bikes" ? <BikeAdmin /> : <UserAdmin />}
    </div>
  );
}
