import { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';

const certificateOptions = [
  'PDC',
  'CMM',
  'sem-wise-marks-memo',
  'TC',
  'Bonafide',
  'Conduct certificate',
  'No due certificate',
  'LoR',
];

const AdminBookingPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched bookings:', data);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveBooking = async (booking) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) throw new Error('Failed to approve booking');

      alert('Booking approved!');
      fetchBookings();
    } catch (err) {
      console.error('Approval failed:', err);
      alert('Failed to approve booking: ' + err.message);
    }
  };

  const rejectBooking = async (booking) => {
    try {
      const token = localStorage.getItem('token');

      // Update booking status to rejected
      const bookingResponse = await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!bookingResponse.ok) throw new Error('Failed to reject booking');

      // Extract slotId as a string (handle both string and object cases)
      const slotId = typeof booking.slotId === 'object' ? booking.slotId._id : booking.slotId;
      if (!slotId) throw new Error('Invalid slotId in booking');

      // Fetch the slot to get the current bookedBy array
      const slotFetch = await fetch(`http://localhost:5000/api/slots/${slotId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!slotFetch.ok) {
        const errorText = await slotFetch.text();
        throw new Error(`Failed to fetch slot: ${slotFetch.status} - ${errorText}`);
      }
      const slot = await slotFetch.json();
      console.log('Fetched slot:', slot); // Debug log

      // Ensure bookedBy is an array, default to empty array if undefined
      const bookedByArray = Array.isArray(slot.bookedBy) ? slot.bookedBy : [];
      const updatedBookedBy = bookedByArray.filter(id => id.toString() !== booking.bookedBy.toString());

      // Update the slot's bookedBy array
      const slotResponse = await fetch(`http://localhost:5000/api/slots/${slotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookedBy: updatedBookedBy }),
      });

      if (!slotResponse.ok) throw new Error('Failed to update slot');

      alert('Booking rejected!');
      fetchBookings();
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('Failed to reject booking: ' + err.message);
    }
  };

  const createSlot = async (e) => {
    e.preventDefault();
    setSlotLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          time,
          capacity: capacity ? Number(capacity) : null,
          certificates,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to create slot');

      alert('Slot created successfully!');
      setDate('');
      setTime('');
      setCapacity('');
      setCertificates([]);
      setModalOpen(false);
    } catch (err) {
      console.error('Error creating slot:', err);
      alert('Failed to create slot: ' + err.message);
    } finally {
      setSlotLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-bold text-gray-800">Booking Panel</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Create Slot
        </button>
      </div>

      {loading ? (
        <div className="w-full flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-6">
          <p>Error: {error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-600 p-6">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 p-6 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-200 p-6 rounded-xl shadow-md bg-white transition hover:shadow-lg"
            >
              <div className="mb-4">
                <p className="text-sm text-gray-500">User</p>
                <p className="text-lg font-medium text-gray-800">
                  {booking.bookedBy?.rollNumber || 'Unknown User'}
                </p>
              </div>

              <div className="mb-4 flex flex-col md:flex-row md:gap-6">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-base font-medium text-gray-800">{booking.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-base font-medium text-gray-800">{booking.time}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Certificates</p>
                <p className="text-base font-medium text-gray-800">
                  {booking.certificates?.join(', ') || 'None'}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Booking Count</p>
                <p className="text-base font-medium text-gray-800">{booking.bookingCount}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`text-base font-semibold ${
                    booking.status === 'approved'
                      ? 'text-green-600'
                      : booking.status === 'rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {booking.file?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Proof of Payment</p>
                  {booking.file.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline block"
                    >
                      View File {idx + 1}
                    </a>
                  ))}
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    onClick={() => approveBooking(booking)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectBooking(booking)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Slot</h2>
            <form onSubmit={createSlot}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Capacity (optional)</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Certificate Type(s)</label>
                <select
                  multiple
                  value={certificates}
                  onChange={(e) => setCertificates(Array.from(e.target.selectedOptions, option => option.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32"
                  required
                >
                  {certificateOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
              </div>

              <button
                type="submit"
                disabled={slotLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                {slotLoading ? 'Creating...' : 'Create Slot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBookingPanel;