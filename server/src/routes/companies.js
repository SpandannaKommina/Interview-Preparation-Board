const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../db/database');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

// Get all companies
router.get('/', (req, res) => {
  const db = getDB();
  const companiesSummary = db.companies.map(c => ({
    id: c.id,
    name: c.name,
    logo: c.logo,
    cadres: c.cadres,
    eligibility: c.eligibility,
    totalRounds: c.selectionProcess.length,
    techQuestionCount: (c.technicalQuestions || []).length,
    hrQuestionCount: (c.hrQuestions || []).length
  }));
  res.json({ companies: companiesSummary });
});

// Get company details by id
router.get('/:id', (req, res) => {
  const db = getDB();
  const company = db.companies.find(c => c.id.toLowerCase() === req.params.id.toLowerCase());

  if (!company) {
    return res.status(404).json({ message: 'Company not found.' });
  }

  res.json({ company });
});

// Submit company-specific practice mock test
router.post('/:id/submit-mock', authenticateToken, (req, res) => {
  const { score, totalQuestions = 10, answers = {} } = req.body;
  const db = getDB();

  const user = db.users.find(u => u.id === req.user.id);
  const earnedXp = Math.round((score / totalQuestions) * 60) + 20;

  if (user) {
    user.xp = (user.xp || 0) + earnedXp;
    user.level = Math.floor(user.xp / 400) + 1;
  }

  if (!db.userProgress[req.user.id]) {
    db.userProgress[req.user.id] = { completedTopics: [], bookmarkedQuestions: [], masteredQuestions: [], stats: {} };
  }
  db.userProgress[req.user.id].stats.testsTaken = (db.userProgress[req.user.id].stats.testsTaken || 0) + 1;

  saveDB();

  res.json({
    message: `Mock test submitted! You scored ${score}/${totalQuestions} and earned +${earnedXp} XP!`,
    score,
    totalQuestions,
    earnedXp
  });
});

module.exports = router;
