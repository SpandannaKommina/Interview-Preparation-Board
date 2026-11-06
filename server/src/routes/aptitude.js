const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDB, saveDB } = require('../db/database');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

// Get questions by category or full test
router.get('/questions', optionalAuth, (req, res) => {
  const { category, difficulty, limit = 10 } = req.query;
  const db = getDB();

  let questions = db.aptitudeQuestions;

  if (category && category !== 'All') {
    questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  if (difficulty && difficulty !== 'All') {
    questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  // Hide correct answer from client during active test
  const clientSafe = questions.slice(0, parseInt(limit, 10)).map(q => {
    const { correctAnswer, explanation, ...safe } = q;
    return safe;
  });

  res.json({
    questions: clientSafe,
    totalAvailable: questions.length,
    categories: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation', 'Analytical Reasoning']
  });
});

// Submit Aptitude Test
router.post('/submit', authenticateToken, (req, res) => {
  const { userAnswers = {}, timeSpentSeconds = 0, enableNegativeMarking = true } = req.body;
  const db = getDB();

  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  const detailedResults = [];

  const questions = db.aptitudeQuestions;

  questions.forEach(q => {
    const userSelected = userAnswers[q.id];
    if (userSelected === undefined || userSelected === null) {
      unattemptedCount++;
      detailedResults.push({
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        userAnswer: null,
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        status: 'Unattempted',
        explanation: q.explanation
      });
    } else if (Number(userSelected) === q.correctAnswer) {
      correctCount++;
      detailedResults.push({
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        userAnswer: userSelected,
        correctAnswer: q.correctAnswer,
        isCorrect: true,
        status: 'Correct',
        explanation: q.explanation
      });
    } else {
      incorrectCount++;
      detailedResults.push({
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        userAnswer: userSelected,
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        status: 'Incorrect',
        explanation: q.explanation
      });
    }
  });

  const penalty = enableNegativeMarking ? 0.25 : 0;
  const rawScore = (correctCount * 1) - (incorrectCount * penalty);
  const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
  const totalAttempted = correctCount + incorrectCount;
  const accuracyPct = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  // Award XP
  const xpEarned = Math.round(finalScore * 10) + 20;
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.xp = (user.xp || 0) + xpEarned;
    user.level = Math.floor(user.xp / 400) + 1;
  }

  // Update stats
  if (!db.userProgress[req.user.id]) {
    db.userProgress[req.user.id] = { completedTopics: [], bookmarkedQuestions: [], masteredQuestions: [], stats: {} };
  }
  db.userProgress[req.user.id].stats.testsTaken = (db.userProgress[req.user.id].stats.testsTaken || 0) + 1;

  // Notification for test completion
  db.notifications.push({
    id: 'notif_' + uuidv4().slice(0, 8),
    userId: req.user.id,
    title: 'Aptitude Test Score: ' + finalScore + ' marks',
    message: `Accuracy: ${accuracyPct}%. You earned +${xpEarned} XP!`,
    type: 'test',
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDB();

  res.json({
    summary: {
      score: finalScore,
      maxScore: questions.length,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracyPct,
      timeSpentSeconds,
      xpEarned
    },
    results: detailedResults
  });
});

module.exports = router;
