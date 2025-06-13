import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './SlotBooking.css';

const SlotBooking = ({ slot, userId, onClose, refreshSlots }) => {
  // State for file uploads, selected certificates, loading, and booking count
  const [files, setFiles] = useState([]); // Files for proof documents
  const [certificates, setCertificates] = useState(slot.certificates || []); // Pre-select slot's certificates
  const [loading, setLoading] = useState(false); // Loading state for booking submission
  const [bookingCount, setBookingCount] = useState(0); // Fetched booking count

  // Fetch the user's booking count for the specific slot
  const fetchBookingCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch bookings');

      const bookings = await response.json();
      console.log('Bookings:', bookings);

      // Filter bookings for the specific slot and status 'approved'
      const approvedBookingsForSlot = bookings.filter(
        booking => booking.slotId._id === slot._id && booking.status === 'approved'
      );
      console.log('Approved bookings for slot:', approvedBookingsForSlot);

      // Set bookingCount to the number of approved bookings for this slot
      setBookingCount(approvedBookingsForSlot.length);
    } catch (err) {
      console.error('Error fetching booking count:', err);
    }
  };

  // Fetch booking count on mount and when slot changes
  useEffect(() => {
    fetchBookingCount();
  }, [slot._id]);

  // Handle booking form submission
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!certificates.length) {
      alert('Please select at least one certificate type.');
      return;
    }
    if (!files.length) {
      alert('Please upload at least one file.');
      return;
    }

    console.log('Selected Certificates:', certificates);
    console.log('Slot Certificates:', slot.certificates);

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('slotId', slot._id);
      formData.append('certificates', JSON.stringify(certificates));
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Booking failed');

      // Show alert notification
      alert('Slot booking request submitted successfully!');

      // Trigger confetti animation
      confetti({
        particleCount: 150,
        spread: 90,
        scalar: 1.5,
        startVelocity: 45,
        origin: { y: 0.6 },
      });
      refreshSlots();  
      onClose();
      console.log(data);
    } catch (err) {
      console.error('Upload or booking error:', err);
      alert('Booking failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove a file from the selected files list
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="slot-overlay">
      <div className="slot-container">
        <button className="close-button" onClick={onClose}>×</button>

        <h3 className="slot-title">
          <i className="fas fa-calendar-alt"></i> Book Slot — <span>{slot.date}</span> at <span>{slot.time}</span>
        </h3>

        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label htmlFor="certificates">Certificate Type(s)</label>
            <p className="text-gray-700 mb-2">Supported: {slot.certificates.join(', ')}</p>
            <select
              id="certificates"
              multiple
              value={certificates}
              onChange={(e) => setCertificates(Array.from(e.target.selectedOptions, (option) => option.value))}
              className="dropdown h-32"
              required
            >
              {slot.certificates.map((cert) => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options (pre-selected by default)</p>
          </div>

          <div className="form-group">
            <label htmlFor="file">Upload Proof Document(s)</label>
            <div className="file-drop-area">
              <input
                type="file"
                id="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                required={files.length === 0}
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
                }}
              />
              <p>Drop files here or click to upload</p>
            </div>

            {files.length > 0 && (
              <ul className="file-list">
                {files.map((file, idx) => (
                  <li key={idx}>
                    {file.name}
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="remove-file"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Display booking count if greater than 0 */}
          {bookingCount > 0 && (
            <div className="form-group">
              <p className="text-gray-700 font-medium">
                Booking Count: <span className="font-bold">{bookingCount}</span>
              </p>
            </div>
          )}

          <div className="button-group">
            <button type="button" onClick={onClose} className="button-cancel">
              <i className="fas fa-times"></i> Cancel
            </button>
            <button type="submit" disabled={loading} className="button-submit">
              <i className="fas fa-upload"></i> {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotBooking;