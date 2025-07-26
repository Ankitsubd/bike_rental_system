// src/pages/user/UserDashboard.jsx
import React, { useState } from "react";

const initialBookings = [
  { id: 1, bike: "E-Bike Pro X", date: "2025-07-22", hours: 2, status: "Confirmed" },
  { id: 2, bike: "Mountain Beast", date: "2025-07-20", hours: 3, status: "Completed" }
];

export default function UserDashboard() {
  const [profile, setProfile] = useState({ name: "Ankit Subedi", email: "ankit@example.com" });
  const [edit, setEdit] = useState(false);
  const [bookings, setBookings] = useState(initialBookings);

  // Profile update logic
  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleProfileSubmit = (e) => { e.preventDefault(); setEdit(false); };

  // Cancel booking logic
  const handleCancel = (id) => setBookings(bookings.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));

  return (
    <div className="pt-28 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">My Dashboard</h1>
      <div className="glass p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-3">Profile</h2>
        {edit ? (
          <form onSubmit={handleProfileSubmit} className="flex gap-4">
            <input name="name" value={profile.name} onChange={handleProfileChange} className="p-2 rounded" />
            <input name="email" value={profile.email} onChange={handleProfileChange} className="p-2 rounded" />
            <button className="bg-purple-700 px-4 py-2 text-white rounded-xl" type="submit">Save</button>
            <button className="bg-gray-500 px-3 py-2 rounded-xl text-white" type="button" onClick={() => setEdit(false)}>Cancel</button>
          </form>
        ) : (
          <div className="flex gap-8 items-center">
            <span>Name: <b>{profile.name}</b></span>
            <span>Email: <b>{profile.email}</b></span>
            <button className="bg-purple-700 px-3 py-2 rounded-xl text-white ml-8" onClick={() => setEdit(true)}>Edit</button>
          </div>
        )}
      </div>
      <div className="glass p-6">
        <h2 className="text-xl font-bold text-white mb-3">My Bookings</h2>
        <table className="w-full text-white mb-2">
          <thead>
            <tr>
              <th>Bike</th><th>Time</th><th>Hours</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.bike}</td>
                <td>{b.time}</td>
                <td>{b.hours}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "Confirmed" && (
                    <button className="text-red-400" onClick={() => handleCancel(b.id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
