import { useEffect, useState } from 'react';
import SlotBooking from './SlotBooking';
import { FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import Navbar from './UserNavbar';

const UserPage = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 9;

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/slots', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch slots');
      const data = await response.json();
      setSlots(data);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);
  const totalPages = Math.ceil(slots.length / slotsPerPage);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#fefefe] to-[#eaecee] py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🗓️ Available Slots</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentSlots.map((slot) => {
              const remaining = slot.capacity - (slot.bookedBy?.length || 0);
              const isFull = remaining <= 0;
              const isBookedByUser = slot.bookedBy.some(id => id.toString() === user._id);
              const isExpired = new Date(slot.date) < new Date().setHours(0, 0, 0, 0);

              return (
                <div
                  key={slot._id}
                  onClick={() =>
                    !isFull && !isExpired && !isBookedByUser && setSelectedSlot(slot)
                  }
                  className={`cursor-pointer bg-white border border-gray-200 shadow-md rounded-xl p-6 transition-transform transform ${
                    !isFull && !isExpired && !isBookedByUser
                      ? 'hover:scale-[1.02] hover:shadow-lg'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center mb-3 text-gray-700">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    <span className="font-medium">Date: {slot.date}</span>
                  </div>
                  <div className="flex items-center mb-3 text-gray-700">
                    <FaClock className="mr-2 text-purple-500" />
                    <span className="font-medium">Time: {slot.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700 mb-2">
                    <FaUsers className="mr-2 text-green-500" />
                    <span className="font-medium">
                      {isFull ? 'No slots available' : `Remaining: ${remaining}`}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-2">
                    <span className="font-medium">
                      Certificates: {slot.certificates?.join(', ') || 'None'}
                    </span>
                  </div>

                  {isExpired && (
                    <div className="text-sm text-red-600 font-semibold mt-1">
                      ⚠️ Slot expired
                    </div>
                  )}
                  {isFull && !isExpired && (
                    <div className="text-sm text-red-500 font-semibold mt-1">
                      ⚠️ This slot is full
                    </div>
                  )}
                  {isBookedByUser && !isExpired && !isFull && (
                    <div className="text-sm text-orange-500 font-semibold mt-1">
                      ⚠️ You already have a booking for this slot
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-full border ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 hover:bg-blue-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {selectedSlot && (
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                📌 Booking Slot
              </h3>
              <SlotBooking
                slot={selectedSlot}
                userId={user._id}
                onClose={() => setSelectedSlot(null)}
                refreshSlots={fetchSlots}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;
