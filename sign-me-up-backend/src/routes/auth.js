const express = require('express'); 
const router = express.Router();
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Debug
router.get('/debug', (req, res) => res.send('AUTH ROUTES LOADED'));

// ----------------------
// REGISTER
// ----------------------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Always USER
      },
    });

    res.json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------
// LOGIN
// ----------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// GET ALL USERS (admin only)
// ----------------------
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// UPDATE USER ROLE (admin only)
// ----------------------
router.put('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (req.userId === userId) {
      return res.status(400).json({ error: "You cannot change your own role." });
    }

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.json({ message: "Role updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
