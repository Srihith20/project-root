import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">

      <div className='flex' >
        <img
          src="https://pbs.twimg.com/profile_images/979349616708718592/Lm73dsE__400x400.jpg" // replace with your actual logo path
          alt="CMRCET Logo"
          className="mx-auto w-20 h-20 mb-3"
        />
         
      </div>

      <div className="space-x-4">
        <Link
          to="/admin"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Bookings
        </Link>
        <Link
          to="/admin/create-slots"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Slots
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="text-red-600 hover:text-red-800 font-medium transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
