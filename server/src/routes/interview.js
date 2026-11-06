const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDB, saveDB } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');
const { getQuestions, evaluateAnswer } = require('../services/aiInterviewService');

// Active in-memory sessions for ongoing interviews
const activeSessions = new Map();

// Start Mock Interview
router.post('/start', authenticateToken, (req, res) => {
  const {
    interviewType = 'Technical Interview',
    role = 'Full Stack Developer',
    difficulty = 'Intermediate',
    questionCount = 3,
    company = 'General'
  } = req.body;

  const count = parseInt(questionCount, 10) || 3;
  const questions = getQuestions(interviewType, role, count);

  const sessionId = 'int_sess_' + uuidv4().slice(0, 10);
  const session = {
    sessionId,
    userId: req.user.id,
    interviewType,
    role,
    difficulty,
    company,
    totalQuestions: questions.length,
    questions,
    currentIndex: 0,
    answers: [],
    startTime: new Date().toISOString()
  };

  activeSessions.set(sessionId, session);

  res.json({
    sessionId,
    interviewType,
    role,
    difficulty,
    totalQuestions: questions.length,
    questions: questions.map(q => ({
      id: q.id,
      question: q.question,
      hint: q.hint,
      category: q.category
    }))
  });
});

// Evaluate Single Answer
router.post('/evaluate-answer', authenticateToken, (req, res) => {
  const { sessionId, questionIndex, answer } = req.body;

  const session = activeSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ message: 'Interview session expired or not found.' });
  }

  const q = session.questions[questionIndex];
  if (!q) {
    return res.status(400).json({ message: 'Invalid question index.' });
  }

  const evaluation = evaluateAnswer(q, answer, session.role);

  // Store answer and evaluation in session
  session.answers[questionIndex] = {
    questionId: q.id,
    question: q.question,
    userAnswer: answer,
    ...evaluation
  };

  res.json({
    questionIndex,
    evaluation
  });
});

// Finish Interview & Generate Comprehensive Report
router.post('/finish', authenticateToken, (req, res) => {
  const { sessionId } = req.body;

  const session = activeSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ message: 'Interview session not found.' });
  }

  const answers = session.answers.filter(Boolean);
  let totalScore = 0;
  let totalAccuracy = 0;
  let totalClarity = 0;
  let totalProblemSolving = 0;
  let totalCompleteness = 0;

  const allStrengths = [];
  const allWeaknesses = [];

  answers.forEach(a => {
    totalScore += a.score || 60;
    totalAccuracy += a.breakdown?.accuracy || 60;
    totalClarity += a.breakdown?.clarity || 60;
    totalProblemSolving += a.breakdown?.problemSolving || 60;
    totalCompleteness += a.breakdown?.completeness || 60;

    if (a.strengths) allStrengths.push(...a.strengths);
    if (a.weaknesses) allWeaknesses.push(...a.weaknesses);
  });

  const count = Math.max(1, answers.length);
  const avgScore = Math.round(totalScore / count);

  const report = {
    id: 'mock_' + uuidv4().slice(0, 8),
    userId: req.user.id,
    interviewType: session.interviewType,
    role: session.role,
    difficulty: session.difficulty,
    company: session.company,
    totalQuestions: session.totalQuestions,
    questionsAttempted: answers.length,
    score: avgScore,
    breakdown: {
      accuracy: Math.round(totalAccuracy / count),
      clarity: Math.round(totalClarity / count),
      problemSolving: Math.round(totalProblemSolving / count),
      completeness: Math.round(totalCompleteness / count)
    },
    strengths: [...new Set(allStrengths)].slice(0, 4),
    weaknesses: [...new Set(allWeaknesses)].slice(0, 4),
    recommendations: avgScore >= 80 
      ? 'Outstanding performance! You are strongly aligned for technical interviews. Keep reviewing system design nuances.'
      : 'Solid effort! Focus on answering with explicit architectural reasoning and structured STAR formats to boost your clarity score.',
    answers,
    createdAt: new Date().toISOString()
  };

  // Save to database
  const db = getDB();
  db.mockInterviews.unshift(report);

  // Award +100 XP
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.xp = (user.xp || 0) + 100;
    user.level = Math.floor(user.xp / 400) + 1;
  }

  // Update mock interviews count
  if (!db.userProgress[req.user.id]) {
    db.userProgress[req.user.id] = { completedTopics: [], bookmarkedQuestions: [], masteredQuestions: [], stats: {} };
  }
  db.userProgress[req.user.id].stats.mockInterviewsCount = (db.userProgress[req.user.id].stats.mockInterviewsCount || 0) + 1;

  // Add achievement notification
  db.notifications.push({
    id: 'notif_' + uuidv4().slice(0, 8),
    userId: req.user.id,
    title: `Mock Interview Completed (${avgScore}%)`,
    message: `You earned 100 XP for completing your ${session.role} ${session.interviewType}.`,
    type: 'interview',
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDB();
  activeSessions.delete(sessionId);

  res.json({
    message: 'Interview completed successfully! +100 XP awarded.',
    report
  });
});

// Get User Interview History
router.get('/history', authenticateToken, (req, res) => {
  const db = getDB();
  const history = db.mockInterviews.filter(m => m.userId === req.user.id);
  res.json({ history });
});

module.exports = router;
