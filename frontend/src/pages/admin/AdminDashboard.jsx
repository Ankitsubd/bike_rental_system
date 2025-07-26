<<<<<<< HEAD
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
=======
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('admin/stats/')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load stats.');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Bikes</h2>
          <p className="text-4xl text-blue-600">{stats.total_bikes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Bookings</h2>
          <p className="text-4xl text-blue-600">{stats.total_bookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold">Pending Reviews</h2>
          <p className="text-4xl text-blue-600">{stats.pending_reviews}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
>>>>>>> 9f18f1dfd77a8cfc4d852284e7ff27e981bf05db
