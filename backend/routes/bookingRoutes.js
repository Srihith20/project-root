const express = require('express');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const cloudinary = require('../config/cloudinary');

module.exports = (authMiddleware, upload) => {
  const router = express.Router();

  // Fetch all bookings (Admin only)
  router.get('/', authMiddleware, async (req, res) => {
    try {
      if (req.user.label !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
      }
      const bookings = await Booking.find()
        .populate('bookedBy', 'rollNumber')
        .populate('slotId', 'date time certificates');
      res.json(bookings);
    } catch (err) {
      console.error('Error fetching all bookings:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Create a booking
  router.post('/', authMiddleware, upload.array('files'), async (req, res) => {
    const { slotId, certificates } = req.body;
    const files = req.files;

    if (!files || files.length === 0) return res.status(400).json({ msg: 'Files are required' });

    try {
      const slot = await Slot.findById(slotId);
      if (!slot) return res.status(404).json({ msg: 'Slot not found' });

      if (slot.bookedBy.length >= slot.capacity) return res.status(400).json({ msg: 'Slot is full' });

      const existingBooking = await Booking.findOne({
        bookedBy: req.user.id,
        slotId: slot._id,
        status: { $in: ['pending', 'approved'] },
      });

      if (existingBooking) {
        return res.status(400).json({ msg: 'You already have a pending or approved booking for this slot' });
      }

      const parsedCertificates = JSON.parse(certificates);
      const invalidCertificates = parsedCertificates.filter(cert => !slot.certificates.includes(cert));
      if (invalidCertificates.length > 0) {
        return res.status(400).json({ msg: `Invalid certificate types: ${invalidCertificates.join(', ')}` });
      }

      const uploadPromises = files.map(file =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }).end(file.buffer);
        })
      );
      const fileUrls = await Promise.all(uploadPromises);

      const booking = new Booking({
        bookedBy: req.user.id,
        slotId,
        file: fileUrls,
        status: 'pending',
        date: slot.date,
        time: slot.time,
        certificates: parsedCertificates,
      });

      await booking.save();

      slot.bookedBy.push(req.user.id);
      slot.files.push(...fileUrls);
      slot.status = slot.bookedBy.length >= slot.capacity ? 'full' : 'available';
      await slot.save();

      res.status(201).json({ msg: 'Booking created', booking });
    } catch (err) {
      console.error('Booking error:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Fetch user's bookings
  router.get('/my-bookings', authMiddleware, async (req, res) => {
    try {
      const bookings = await Booking.find({ bookedBy: req.user.id })
        .populate('slotId', 'date time certificates');
      res.json(bookings);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Update booking status (Admin only)
  router.patch('/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;

    try {
      if (req.user.label !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ msg: 'Booking not found' });

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status value' });
      }

      if (status === 'approved' && booking.status !== 'approved') {
        booking.bookingCount = (booking.bookingCount || 0) + 1;
      } else if (status === 'rejected' && booking.status === 'approved') {
        if (booking.bookingCount > 0) {
          booking.bookingCount -= 1;
        }
      }

      booking.status = status;

      if (status === 'rejected') {
        const slot = await Slot.findById(booking.slotId);
        if (!slot) return res.status(404).json({ msg: 'Associated slot not found' });

        slot.bookedBy = slot.bookedBy.filter(id => id.toString() !== booking.bookedBy.toString());
        slot.files = slot.files.filter(fileUrl => !booking.file.includes(fileUrl));
        slot.status = slot.bookedBy.length >= slot.capacity ? 'full' : 'available';
        await slot.save();
      }

      await booking.save();

      res.json({ msg: `Booking ${status}`, booking });
    } catch (err) {
      console.error('Error updating booking:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Edit a booking (User only, pending status)
  router.patch('/:id/edit', authMiddleware, upload.array('files'), async (req, res) => {
    const { certificates } = req.body;
    const files = req.files;
    const bookingId = req.params.id;

    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ msg: 'Booking not found' });

      if (booking.bookedBy.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'You can only edit your own bookings' });
      }

      if (booking.status !== 'pending') {
        return res.status(400).json({ msg: 'Only pending bookings can be edited' });
      }

      const slot = await Slot.findById(booking.slotId);
      if (!slot) return res.status(404).json({ msg: 'Associated slot not found' });

      const parsedCertificates = JSON.parse(certificates);
      const invalidCertificates = parsedCertificates.filter(cert => !slot.certificates.includes(cert));
      if (invalidCertificates.length > 0) {
        return res.status(400).json({ msg: `Invalid certificate types: ${invalidCertificates.join(', ')}` });
      }

      let fileUrls = booking.file;
      if (files && files.length > 0) {
        const uploadPromises = files.map(file =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }).end(file.buffer);
          })
        );
        fileUrls = await Promise.all(uploadPromises);

        slot.files = slot.files.filter(fileUrl => !booking.file.includes(fileUrl));
        slot.files.push(...fileUrls);
        await slot.save();
      }

      booking.certificates = parsedCertificates;
      booking.file = fileUrls;
      await booking.save();

      res.json({ msg: 'Booking updated', booking });
    } catch (err) {
      console.error('Error editing booking:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  return router;
};