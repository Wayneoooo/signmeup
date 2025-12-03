const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// -----------------------
// GET all events (public)
// -----------------------
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get all evnts a user signed up for
router.get('/my-signups', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const signups = await prisma.signup.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });

    const events = signups.map(s => s.event);

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// GET single event with user signup info
// -----------------------
router.get('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check if the logged-in user is signed up
    let userSignedUp = false;
    if (req.userId) {
      const signup = await prisma.signup.findUnique({
        where: { userId_eventId: { userId: req.userId, eventId: id } },
      });
      userSignedUp = !!signup;
    }

    res.json({ ...event, userSignedUp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// CREATE event (admin only)
// -----------------------
router.post('/', auth, isAdmin, async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    const event = await prisma.event.create({
      data: { title, description, date: new Date(date), location },
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// SIGN UP for event
// -----------------------
router.post('/:id/signup', auth, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = req.userId;

    // prevent double signups
    const existing = await prisma.signup.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing)
      return res.status(400).json({ error: 'Already signed up' });

    const signup = await prisma.signup.create({
      data: { userId, eventId },
    });

    res.json({ message: 'Signup successful', signup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// CANCEL signup
// -----------------------
router.delete('/:id/signup', auth, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = req.userId;

    const existing = await prisma.signup.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });

    if (!existing) {
      return res.status(400).json({ error: 'Not signed up for this event' });
    }

    await prisma.signup.delete({
      where: { userId_eventId: { userId, eventId } }
    });

    res.json({ message: 'Signup canceled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// GET signups for event (admin only)
// -----------------------
router.get('/:my-signups', auth, isAdmin, async (req, res) => {
  try {
    const eventId = Number(req.params.id);

    const signups = await prisma.signup.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(signups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// UPDATE event (admin only)
// -----------------------
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const { title, description, date, location } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title ?? event.title,
        description: description ?? event.description,
        date: date ? new Date(date) : event.date,
        location: location ?? event.location,
      },
    });

    res.json({ message: 'Event updated', event: updatedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// DELETE event (admin only)
// -----------------------
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.event.delete({ where: { id } });

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

