import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="mt-2">
          <Link to="/admin-dashboard/dashboard" className="mr-4">Dashboard</Link>
          <Link to="/admin-dashboard/bikes" className="mr-4">Manage Bikes</Link>
          <Link to="/admin-dashboard/bookings" className="mr-4">Manage Bookings</Link>
          <Link to="/admin-dashboard/reviews">Moderate Reviews</Link>
        </nav>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
