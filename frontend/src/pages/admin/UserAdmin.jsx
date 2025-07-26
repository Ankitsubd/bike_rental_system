import React,{useState} from "react";

const initialUsers = [
  { id: 1, name: "Ankit Subedi", email: "ankit@example.com", role: "User" },
  { id: 2, name: "Admin User", email: "admin@example.com", role: "Admin" }
];

export default function UserAdmin() {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ name: "", email: "", role: "User" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...form, id: editId } : u));
      setEditId(null);
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    setForm({ name: "", email: "", role: "User" });
  };

  const handleDelete = (id) => setUsers(users.filter(u => u.id !== id));

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm(user);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
      <form onSubmit={handleSubmit} className="glass p-4 rounded-xl mb-6 flex gap-4 flex-wrap items-end">
        <input name="name" placeholder="Name" className="p-2 rounded" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" className="p-2 rounded" value={form.email} onChange={handleChange} required />
        <select name="role" className="p-2 rounded" value={form.role} onChange={handleChange}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="bg-purple-700 px-4 py-2 text-white rounded-xl" type="submit">{editId ? "Update" : "Add"}</button>
        {editId && <button className="bg-gray-500 px-3 py-2 rounded-xl text-white" type="button" onClick={() => { setEditId(null); setForm({ name: "", email: "", role: "User" }); }}>Cancel</button>}
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="text-yellow-400 mr-3" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="text-red-400" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
