const express = require('express');
const Slot = require('../models/Slot');

module.exports = (authMiddleware) => {
  const router = express.Router();

  // Create a slot
  router.post('/', authMiddleware, async (req, res) => {
    const { date, time, capacity, certificates } = req.body;
    try {
      if (req.user.label !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
      }
      const slot = new Slot({
        date,
        time,
        capacity,
        certificates,
        bookedBy: [],
        files: [],
        status: 'available',
      });
      await slot.save();
      res.status(201).json({ msg: 'Slot created', slot });
    } catch (err) {
      console.error('Error creating slot:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Get all slots
  router.get('/', authMiddleware, async (req, res) => {
    try {
      const slots = await Slot.find();
      res.json(slots);
    } catch (err) {
      console.error('Error fetching slots:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Get a single slot by ID
  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const slot = await Slot.findById(req.params.id);
      if (!slot) return res.status(404).json({ msg: 'Slot not found' });
      res.json(slot);
    } catch (err) {
      console.error('Error fetching slot:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Update a slot
  router.patch('/:id', authMiddleware, async (req, res) => {
    const { bookedBy } = req.body;
    try {
      if (req.user.label !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
      }
      const slot = await Slot.findById(req.params.id);
      if (!slot) return res.status(404).json({ msg: 'Slot not found' });
      if (bookedBy) slot.bookedBy = bookedBy;
      slot.status = slot.bookedBy.length >= slot.capacity ? 'full' : 'available';
      await slot.save();
      res.json({ msg: 'Slot updated', slot });
    } catch (err) {
      console.error('Error updating slot:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  // Delete a slot
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      if (req.user.label !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
      }
      const slot = await Slot.findById(req.params.id);
      if (!slot) return res.status(404).json({ msg: 'Slot not found' });

      await slot.deleteOne();
      res.json({ msg: 'Slot deleted' });
    } catch (err) {
      console.error('Error deleting slot:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

  return router;
};