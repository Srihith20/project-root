import { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';

// Certificate options for the edit modal, matching AdminCreateSlotPage and AdminBookingPanel
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

const AdminSlotsPanel = () => {
  // State for slots data, loading, errors, and edit modal
  const [slots, setSlots] = useState([]); // Array of slot objects
  const [loading, setLoading] = useState(false); // Loading state for fetching slots
  const [error, setError] = useState(null); // Error message for failed fetches
  const [editModalOpen, setEditModalOpen] = useState(false); // Edit modal visibility
  const [selectedSlot, setSelectedSlot] = useState(null); // Currently selected slot for editing
  const [editDate, setEditDate] = useState(''); // Edit form: date
  const [editTime, setEditTime] = useState(''); // Edit form: time
  const [editCapacity, setEditCapacity] = useState(''); // Edit form: capacity
  const [editCertificates, setEditCertificates] = useState([]); // Edit form: certificates
  const [editLoading, setEditLoading] = useState(false); // Loading state for edit submission
  const [deleteLoading, setDeleteLoading] = useState(false); // Loading state for delete action

  // Fetch all slots from the backend
  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:5000/api/slots', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.statusText}`);
      }

      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open the edit modal and pre-fill form with slot details
  const openEditModal = (slot) => {
    setSelectedSlot(slot);
    setEditDate(slot.date);
    setEditTime(slot.time);
    setEditCapacity(slot.capacity || '');
    setEditCertificates(slot.certificates || []);
    setEditModalOpen(true);
  };

  // Handle edit form submission
  const editSlot = async (e) => {
    e.preventDefault();
    if (editCertificates.length === 0) {
      alert('Please select at least one certificate.');
      return;
    }
    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/slots/${selectedSlot._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: editDate,
          time: editTime,
          capacity: editCapacity ? Number(editCapacity) : null,
          certificates: editCertificates,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to update slot');

      alert('Slot updated successfully!');
      setEditModalOpen(false);
      fetchSlots(); // Refresh slot list
    } catch (err) {
      console.error('Error updating slot:', err);
      alert('Failed to update slot: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle slot deletion
  const deleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/slots/${slotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete slot');

      alert('Slot deleted successfully!');
      fetchSlots(); // Refresh slot list
    } catch (err) {
      console.error('Error deleting slot:', err);
      alert('Failed to delete slot: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Fetch slots on component mount
  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <>
      {/* Navigation bar */}
      <AdminNavbar />

      {/* Main content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Slots Panel</h2>

        {/* Loading state */}
        {loading ? (
          <div className="w-full flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : error ? (
          /* Error state */
          <div className="text-center text-red-600 p-6">
            <p>Error: {error}</p>
            <button
              onClick={fetchSlots}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        ) : slots.length === 0 ? (
          /* No slots state */
          <div className="text-center text-gray-600 p-6">
            <p>No slots found.</p>
          </div>
        ) : (
          /* Slots grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="border border-gray-200 p-6 rounded-xl shadow-md bg-white transition hover:shadow-lg"
              >
                {/* Slot Date */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-base font-medium text-gray-800">{slot.date}</p>
                </div>

                {/* Slot Time */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-base font-medium text-gray-800">{slot.time}</p>
                </div>

                {/* Slot Capacity */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-base font-medium text-gray-800">{slot.capacity || 'Unlimited'}</p>
                </div>

                {/* Slot Certificates */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Certificates</p>
                  <p className="text-base font-medium text-gray-800">
                    {slot.certificates?.join(', ') || 'None'}
                  </p>
                </div>

                {/* Slot Status */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`text-base font-semibold ${
                      slot.status === 'available' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>

                {/* Booked Users */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Booked Users</p>
                  <p className="text-base font-medium text-gray-800">
                    {slot.bookedBy.length > 0
                      ? slot.bookedBy.map((user) => user.rollNumber).join(', ')
                      : 'None'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openEditModal(slot)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    disabled={editLoading || deleteLoading}
                  >
                    Edit Slot
                  </button>
                  <button
                    onClick={() => deleteSlot(slot._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    disabled={editLoading || deleteLoading}
                  >
                    Delete Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
              {/* Close Button */}
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4">Edit Slot</h2>

              <form onSubmit={editSlot}>
                {/* Date Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                {/* Time Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                {/* Capacity Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Capacity (optional)</label>
                  <input
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    min="1"
                    placeholder="Leave blank for unlimited"
                  />
                </div>

                {/* Certificates Multi-Select */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">Certificate Type(s)</label>
                  <select
                    multiple
                    value={editCertificates}
                    onChange={(e) =>
                      setEditCertificates(Array.from(e.target.selectedOptions, (option) => option.value))
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32"
                    required
                  >
                    {certificateOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={editLoading || deleteLoading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:bg-indigo-400"
                >
                  {editLoading ? 'Updating...' : 'Update Slot'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSlotsPanel;