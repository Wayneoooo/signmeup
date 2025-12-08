const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const sendEmail = require("../utils/email/sendEmail");
const { signupTemplate, cancelTemplate } = require("../utils/email/templates");

// -----------------------
// GET all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all events a user signed up for
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

// GET single event with user signup info
router.get('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

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

// CREATE event (admin only)
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
router.post('/:id/signup', auth, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = req.userId;

    // prevent double signups
    const existing = await prisma.signup.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) return res.status(400).json({ error: 'Already signed up' });

    const signup = await prisma.signup.create({ data: { userId, eventId } });

    // Send signup confirmation email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    try {
      await sendEmail({
        to: user.email,
        subject: `You signed up for ${event.title}`,
        html: signupTemplate(user.name, event),
      });
      console.log(`Signup email sent to ${user.email}`);
    } catch (err) {
      console.error("Failed to send signup email:", err);
    }

    res.json({ message: 'Signup successful', signup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// CANCEL signup
router.delete('/:id/signup', auth, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const userId = req.userId;

    const existing = await prisma.signup.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });
    if (!existing) return res.status(400).json({ error: 'Not signed up for this event' });

    await prisma.signup.delete({ where: { userId_eventId: { userId, eventId } } });

    // Send cancellation email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    try {
      await sendEmail({
        to: user.email,
        subject: `You canceled your signup for ${event.title}`,
        html: cancelTemplate(user.name, event),
      });
      console.log(`Cancellation email sent to ${user.email}`);
    } catch (err) {
      console.error("Failed to send cancellation email:", err);
    }

    res.json({ message: 'Signup canceled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

