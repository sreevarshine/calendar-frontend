import express from 'express';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

import Event from '../models/Event.js'; // 🔔 include .js extension in ESM
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Helper function for consistent error responses
const errorResponse = (res, status, message, error = null) => {
  const response = { success: false, message };
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message;
  }
  return res.status(status).json(response);
};

// Create an event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, date, startTime, endTime, color, description } = req.body;

    if (!title || !date || !startTime || !endTime) {
      return errorResponse(res, 400, 'Missing required fields');
    }

    if (!dayjs(date).isValid()) {
      return errorResponse(res, 400, 'Invalid date format');
    }

    const event = new Event({
      title,
      date,
      startTime,
      endTime,
      color: color || '#2563EB',
      description: description || '',
      userId: req.user.id
    });

    await event.save();

    return res.status(201).json({ success: true, event });
  } catch (err) {
    console.error('Create event error:', err);
    return errorResponse(res, 500, 'Failed to create event', err);
  }
});

// Get all events for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({ date: 1, startTime: 1 });
    return res.json({ success: true, count: events.length, events });
  } catch (err) {
    console.error('Fetch events error:', err);
    return errorResponse(res, 500, 'Failed to fetch events', err);
  }
});

// Update an event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, 'Invalid event ID');
    }

    const event = await Event.findOne({ _id: id, userId: req.user.id });
    if (!event) {
      return errorResponse(res, 404, 'Event not found or unauthorized');
    }

    Object.keys(updates).forEach((key) => {
      event[key] = updates[key];
    });

    await event.save();

    return res.json({ success: true, event });
  } catch (err) {
    console.error('Update event error:', err);
    return errorResponse(res, 500, 'Failed to update event', err);
  }
});

// Delete an event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, 'Invalid event ID');
    }

    const event = await Event.findOne({ _id: id, userId: req.user.id });
    if (!event) {
      return errorResponse(res, 404, 'Event not found or unauthorized');
    }

    await event.deleteOne();

    return res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    return errorResponse(res, 500, 'Failed to delete event', err);
  }
});

export default router;
