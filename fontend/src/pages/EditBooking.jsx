import { useState } from 'react';
import './SlotBooking.css'; // Reuse SlotBooking.css for styling

const EditBooking = ({ booking, onClose, refreshBookings }) => {
  const [files, setFiles] = useState([]);
  const [certificates, setCertificates] = useState(booking.certificates || []);
  const [loading, setLoading] = useState(false);

  const handleEditBooking = async (e) => {
    e.preventDefault();

    if (!certificates.length) {
      alert('Please select at least one certificate type.');
      return;
    }
    if (!files.length && !booking.file.length) {
      alert('Please upload at least one file or keep existing files.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('certificates', JSON.stringify(certificates));
      files.forEach((file) => formData.append('files', file));

      const response = await fetch(`http://localhost:5000/api/bookings/${booking._id}/edit`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to update booking');

      alert('Booking updated successfully!');
      refreshBookings();
      onClose();
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="slot-overlay">
      <div className="slot-container">
        <button className="close-button" onClick={onClose}>×</button>

        <h3 className="slot-title">
          <i className="fas fa-edit"></i> Edit Booking — <span>{booking.date}</span> at <span>{booking.time}</span>
        </h3>

        <form onSubmit={handleEditBooking}>
          <div className="form-group">
            <label htmlFor="certificates">Certificate Type(s)</label>
            <p className="text-gray-700 mb-2">Supported: {booking.slotId.certificates.join(', ')}</p>
            <select
              id="certificates"
              multiple
              value={certificates}
              onChange={(e) => setCertificates(Array.from(e.target.selectedOptions, (option) => option.value))}
              className="dropdown h-32"
              required
            >
              {booking.slotId.certificates.map((cert) => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
          </div>

          <div className="form-group">
            <label htmlFor="file">Upload New Proof Document(s)</label>
            <div className="file-drop-area">
              <input
                type="file"
                id="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
                }}
              />
              <p>Drop files here or click to upload (replaces existing files if uploaded)</p>
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

            {booking.file.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-700 font-medium">Existing Files:</p>
                <ul className="file-list">
                  {booking.file.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Document {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="button-group">
            <button type="button" onClick={onClose} className="button-cancel">
              <i className="fas fa-times"></i> Cancel
            </button>
            <button type="submit" disabled={loading} className="button-submit">
              <i className="fas fa-save"></i> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBooking;