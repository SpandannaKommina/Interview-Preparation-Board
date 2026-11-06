const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../db/database');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

// Get question bank list with filters
router.get('/', optionalAuth, (req, res) => {
  const { category, difficulty, search, company } = req.query;
  const db = getDB();

  let questions = db.questionBank;

  if (category && category !== 'All') {
    questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  if (difficulty && difficulty !== 'All') {
    questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (company && company !== 'All') {
    questions = questions.filter(q => q.companyTags && q.companyTags.some(c => c.toLowerCase() === company.toLowerCase()));
  }

  if (search) {
    const s = search.toLowerCase();
    questions = questions.filter(q => 
      q.question.toLowerCase().includes(s) || 
      q.answer.toLowerCase().includes(s) ||
      (q.keyConcepts || []).some(k => k.toLowerCase().includes(s))
    );
  }

  let bookmarks = [];
  let mastered = [];
  if (req.user && db.userProgress[req.user.id]) {
    bookmarks = db.userProgress[req.user.id].bookmarkedQuestions || [];
    mastered = db.userProgress[req.user.id].masteredQuestions || [];
  }

  const enriched = questions.map(q => ({
    ...q,
    isBookmarked: bookmarks.includes(q.id),
    isMastered: mastered.includes(q.id)
  }));

  res.json({
    questions: enriched,
    total: db.questionBank.length,
    categories: ['All', 'Technical', 'HR', 'DBMS', 'OOPs', 'Operating Systems', 'Computer Networks']
  });
});

// Toggle master question
router.post('/toggle-master', authenticateToken, (req, res) => {
  const { questionId } = req.body;
  const db = getDB();

  if (!db.userProgress[req.user.id]) {
    db.userProgress[req.user.id] = { completedTopics: [], bookmarkedQuestions: [], masteredQuestions: [], stats: {} };
  }

  const mastered = db.userProgress[req.user.id].masteredQuestions || [];
  const idx = mastered.indexOf(questionId);
  let isMastered = false;

  if (idx === -1) {
    mastered.push(questionId);
    isMastered = true;
    // Award +15 XP
    const user = db.users.find(u => u.id === req.user.id);
    if (user) {
      user.xp = (user.xp || 0) + 15;
    }
  } else {
    mastered.splice(idx, 1);
    isMastered = false;
  }

  db.userProgress[req.user.id].masteredQuestions = mastered;
  saveDB();

  res.json({
    message: isMastered ? 'Marked as Mastered! (+15 XP)' : 'Marked as Unmastered.',
    isMastered,
    masteredQuestions: mastered
  });
});

module.exports = router;
