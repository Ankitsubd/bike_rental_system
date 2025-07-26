import React,{useState} from "react";

const initalBikes = [
    {id: 1, title: 'E-bike Pro X', type: 'E-bike',rate: 300, available:true},
     { id: 2, title: "Mountain Beast", type: "Mountain", rate: 250, available: true }
];

export default function BikeAdmin(){
    const [bikes, setBikes] = useState(initalBikes);
    const [form, setForm] = useState({ title: "", type: "", rate: "", available: true });
  const [editId, setEditId] = useState(null);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setBikes(bikes.map(b => b.id === editId ? { ...form, id: editId } : b));
      setEditId(null);
    } else {
      setBikes([...bikes, { ...form, id: Date.now() }]);
    }
    setForm({ title: "", type: "", rate: "", available: true });
  };

  
  const handleDelete = (id) => setBikes(bikes.filter(b => b.id !== id));

  
  const handleEdit = (bike) => {
    setEditId(bike.id);
    setForm(bike);
  };
return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Bike Management</h2>
      <form onSubmit={handleSubmit} className="glass p-4 rounded-xl mb-6 flex gap-4 flex-wrap items-end">
        <input name="title" placeholder="Title" className="p-2 rounded" value={form.title} onChange={handleChange} required />
        <input name="type" placeholder="Type" className="p-2 rounded" value={form.type} onChange={handleChange} required />
        <input name="rate" type="number" placeholder="Rate" className="p-2 rounded" value={form.rate} onChange={handleChange} required />
        <select name="available" className="p-2 rounded" value={form.available} onChange={e => setForm({ ...form, available: e.target.value === "true" })}>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <button className="bg-purple-700 px-4 py-2 text-white rounded-xl" type="submit">{editId ? "Update" : "Add"}</button>
        {editId && <button className="bg-gray-500 px-3 py-2 rounded-xl text-white" type="button" onClick={() => { setEditId(null); setForm({ title: "", type: "", rate: "", available: true }); }}>Cancel</button>}
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr>
              <th>Title</th><th>Type</th><th>Rate</th><th>Available</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map(bike => (
              <tr key={bike.id}>
                <td>{bike.title}</td>
                <td>{bike.type}</td>
                <td>{bike.rate}</td>
                <td>{bike.available ? "Yes" : "No"}</td>
                <td>
                  <button className="text-yellow-400 mr-3" onClick={() => handleEdit(bike)}>Edit</button>
                  <button className="text-red-400" onClick={() => handleDelete(bike.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
)
}