import { useState } from 'react';

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

const AdminCreateSlotPage = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [certificates, setCertificates] = useState([]); // Changed to array
  const [loading, setLoading] = useState(false);

  const createSlot = async (e) => {
    e.preventDefault();
    setLoading(true);

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
          certificates, // Array of certificates
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to create slot');

      alert('Slot created successfully!');
      setDate('');
      setTime('');
      setCapacity('');
      setCertificates([]);
    } catch (err) {
      console.error('Error creating slot:', err);
      alert('Failed to create slot: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <div className="flex gap-4">
          <a href="/admin/bookings" className="hover:underline">Bookings</a>
          <a href="/admin/create-slot" className="hover:underline">Create Slot</a>
        </div>
      </nav>

      <div className="p-6 flex justify-center">
        <form onSubmit={createSlot} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Slot</h2>

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
            <label className="block text-sm font-medium text-gray-700">Max Capacity (optional)</label>
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
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            {loading ? 'Creating...' : 'Create Slot'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateSlotPage;