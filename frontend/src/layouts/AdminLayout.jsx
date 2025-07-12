import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const AdminLayout = ({children})=>{
    const {logout} = useAuth();
    const navigate = useNavigate();

    return(
        <div className="flex h-screen bg-gray-100">
            {/** Sidebar*/}
            <aside className="w-64 bg-white shadow-md p-6 space-y-4">
                <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
                <nav className="space-y-2">
                    <button onClick={()=> navigate('/admin')} className="block w-full text-left text-gray-700 hover:text-blue-600">
                        Dashboard
                    </button>
                    <button onClick={()=> navigate('/admin/bikes')} className="block w-full text-left text-gray-700 hover:text-blue-600">
                        Manage Bikes
                    </button>
                    <button onClick={()=> navigate('/admin/bookings')} className="block w-full text-left text-gray-700 hover:text-blue-600">
                        Manage Bookings                   </button>
                    <button onClick={()=> navigate('/admin/reviews')} className="block w-full text-left text-gray-700 hover:text-blue-600">
                        Moderate Reviews
                    </button>
                </nav>
                <button onClick={logout} className="mt-10 text-red-500 hover:underline">
                        LogOut
                </button>
            </aside>

            {/**Main Content */}
            <main className="flex-grow p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    {children}
                </div>
            </main>
        </div>
    )
};

export default AdminLayout;