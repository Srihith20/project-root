import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { MdOutlinePendingActions, MdDone, MdClose } from 'react-icons/md';
import Navbar from './UserNavbar';
import EditBooking from './EditBooking';

const UserBookings = () => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) {
        console.error('No user found in localStorage');
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found in localStorage');

        const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched bookings:', data); // Debug: Log bookings
        setUserBookings(data);
      } catch (err) {
        console.error('Error fetching user bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <MdDone className="text-green-500 text-lg inline-block mr-1" />;
      case 'pending':
        return <MdOutlinePendingActions className="text-yellow-500 text-lg inline-block mr-1" />;
      default:
        return <MdClose className="text-red-500 text-lg inline-block mr-1" />;
    }
  };

  const refreshBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      console.log('Refreshed bookings:', data); // Debug: Log refreshed bookings
      setUserBookings(data);
    } catch (err) {
      console.error('Error refreshing bookings:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">📋 My Bookings</h2>

          {loading ? (
            <div className="flex justify-center items-center text-xl text-gray-600">
              <FaSpinner className="animate-spin mr-2" /> Loading your bookings...
            </div>
          ) : !user ? (
            <p className="text-center text-red-600 text-lg">Error: User not logged in. Please log in again.</p>
          ) : userBookings.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">You have no bookings yet.</p>
          ) : (
            <div className="grid gap-6">
              {userBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transition-transform transform hover:scale-[1.01]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <FaCalendarAlt className="text-blue-500" />
                      <p className="text-gray-700 font-medium">Date: {booking.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaClock className="text-purple-500" />
                      <p className="text-gray-700 font-medium">Time: {booking.time}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-800 font-semibold flex items-center">
                      {getStatusIcon(booking.status)} Status:
                      <span
                        className={`ml-2 capitalize font-bold ${
                          booking.status === 'approved'
                            ? 'text-green-600'
                            : booking.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 font-medium">
                      Certificate Type: <span className="font-bold">{booking.certificates.join(', ')}</span>
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 font-medium">
                      Booking Count: <span className="font-bold">{booking.bookingCount}</span>
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 font-medium flex items-center">
                      <FaFileAlt className="text-indigo-500 mr-2" />
                      Proof File:{' '}
                      {booking.file.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 underline hover:text-blue-800"
                        >
                          View Document {idx + 1}
                        </a>
                      ))}
                    </p>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingBooking(booking)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                      >
                        <i className="fas fa-edit mr-2"></i>Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {editingBooking && (
            <EditBooking
              booking={editingBooking}
              onClose={() => setEditingBooking(null)}
              refreshBookings={refreshBookings}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserBookings;