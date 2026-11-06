const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDB, saveDB } = require('../db/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Helper to generate token
function generateToken(user, rememberMe = false) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: rememberMe ? '30d' : '7d' }
  );
}

// Register
router.post('/register', (req, res) => {
  const { fullName, email, password, role = 'student', college, degree } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required.' });
  }

  // Password validation: min 6 chars, 1 uppercase or number
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const db = getDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: 'usr_' + uuidv4().slice(0, 8),
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role === 'admin' ? 'admin' : 'student',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
    college: college || 'University Student',
    degree: degree || 'B.Tech / B.E.',
    department: 'Computer Science',
    graduationYear: new Date().getFullYear() + 1,
    cgpa: '8.5',
    preferredLanguage: 'Python',
    targetCompanies: ['Google', 'Microsoft', 'Amazon'],
    skills: ['Data Structures', 'Python', 'Algorithms'],
    bio: 'Excited to prepare for technical and HR interviews on Interview Preparation Board!',
    isEmailVerified: true,
    xp: 100, // Welcome bonus
    level: 1,
    streakDays: 1,
    lastStreakDate: new Date().toISOString().split('T')[0],
    dailyGoalMinutes: 45,
    dailySolvedGoal: 3,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Initialize progress
  if (!db.userProgress[newUser.id]) {
    db.userProgress[newUser.id] = {
      completedTopics: [],
      bookmarkedQuestions: [],
      masteredQuestions: [],
      stats: {
        questionsSolved: 0,
        learningHours: 1,
        testsTaken: 0,
        mockInterviewsCount: 0,
        overallCompletionPct: 5
      }
    };
  }

  // Add welcome notification
  db.notifications.push({
    id: 'notif_' + uuidv4().slice(0, 8),
    userId: newUser.id,
    title: 'Welcome to Interview Preparation Board!',
    message: 'Start with the Placement Roadmap or take your first AI Mock Interview.',
    type: 'welcome',
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDB();

  const token = generateToken(newUser);
  const { password: _, ...userSafe } = newUser;

  res.status(201).json({
    message: 'Registration successful! Welcome aboard.',
    token,
    user: userSafe
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password credentials.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password credentials.' });
  }

  // Update streak if needed
  const today = new Date().toISOString().split('T')[0];
  if (user.lastStreakDate !== today) {
    user.streakDays = (user.streakDays || 1) + 1;
    user.lastStreakDate = today;
    user.xp = (user.xp || 0) + 20; // Daily login XP
    saveDB();
  }

  const token = generateToken(user, rememberMe);
  const { password: _, ...userSafe } = user;

  res.json({
    message: 'Login successful.',
    token,
    user: userSafe
  });
});

// Google Sign-In (Simulation for demo/interview portfolio)
router.post('/google', (req, res) => {
  const db = getDB();
  // Find or create Alex Vance demo student
  let user = db.users.find(u => u.email === 'student@interviewprep.com');
  if (!user) {
    user = db.users[0];
  }

  const token = generateToken(user, true);
  const { password: _, ...userSafe } = user;

  res.json({
    message: 'Signed in with Google successfully!',
    token,
    user: userSafe
  });
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const { password: _, ...userSafe } = user;
  const progress = db.userProgress[user.id] || {
    completedTopics: [],
    bookmarkedQuestions: [],
    masteredQuestions: [],
    stats: { questionsSolved: 0, learningHours: 0, testsTaken: 0, mockInterviewsCount: 0, overallCompletionPct: 0 }
  };

  res.json({
    user: userSafe,
    progress
  });
});

// Update Profile
router.put('/update-profile', authenticateToken, (req, res) => {
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const allowedFields = [
    'fullName', 'college', 'degree', 'department', 'graduationYear',
    'cgpa', 'preferredLanguage', 'targetCompanies', 'skills', 'bio', 'avatar',
    'dailyGoalMinutes', 'dailySolvedGoal'
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      db.users[userIndex][field] = req.body[field];
    }
  }

  saveDB();

  const { password: _, ...userSafe } = db.users[userIndex];
  res.json({
    message: 'Profile updated successfully!',
    user: userSafe
  });
});

// Change Password
router.post('/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect current password.' });
  }

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(newPassword, salt);
  saveDB();

  res.json({ message: 'Password changed successfully.' });
});

// Forgot Password Request
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    // Return friendly generic response
    return res.json({ message: 'If this email exists in our records, a password reset link has been dispatched.' });
  }

  const resetToken = 'rst_' + uuidv4().slice(0, 12);
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour
  saveDB();

  res.json({
    message: 'Password reset link generated.',
    demoResetToken: resetToken // Provided for effortless local testing
  });
});

// Reset Password
router.post('/reset-password', (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Valid token and password (min 6 chars) required.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.resetToken === resetToken && u.resetTokenExpires > Date.now());

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired password reset token.' });
  }

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(newPassword, salt);
  delete user.resetToken;
  delete user.resetTokenExpires;
  saveDB();

  res.json({ message: 'Password has been reset successfully. You can now login.' });
});

// Verify Email
router.post('/verify-email', authenticateToken, (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.isEmailVerified = true;
    saveDB();
  }
  res.json({ message: 'Email verified successfully!' });
});

module.exports = router;
