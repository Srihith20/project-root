import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className='flex items-center' >
        <img
          src="https://pbs.twimg.com/profile_images/979349616708718592/Lm73dsE__400x400.jpg" // replace with your actual logo path
          alt="CMRCET Logo"
          className="mx-auto w-20 h-20 mb-3"
        />
        
      </div>

      <div className="space-x-4 flex items-center">
        <Link
          to="/user"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Home
        </Link>
        <Link
          to="/user/bookings"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          My Bookings
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
