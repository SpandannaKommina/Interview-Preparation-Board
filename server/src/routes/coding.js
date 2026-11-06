const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDB, saveDB } = require('../db/database');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const { executeCode } = require('../services/codeExecutionService');

// Get questions list
router.get('/questions', optionalAuth, (req, res) => {
  const { topic, difficulty, search, company } = req.query;
  const db = getDB();

  let questions = db.codingQuestions.map(q => {
    const { testCases, ...safeQ } = q;
    return safeQ;
  });

  if (topic && topic !== 'All') {
    questions = questions.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
  }

  if (difficulty && difficulty !== 'All') {
    questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (company && company !== 'All') {
    questions = questions.filter(q => q.companies && q.companies.some(c => c.toLowerCase() === company.toLowerCase()));
  }

  if (search) {
    const s = search.toLowerCase();
    questions = questions.filter(q => q.title.toLowerCase().includes(s) || q.description.toLowerCase().includes(s));
  }

  // Attach bookmarks & solved status if user is logged in
  let bookmarked = [];
  let solvedIds = [];

  if (req.user) {
    if (db.userProgress[req.user.id]) {
      bookmarked = db.userProgress[req.user.id].bookmarkedQuestions || [];
    }
    const userSubmissions = db.submissions.filter(s => s.userId === req.user.id && s.status === 'Accepted');
    solvedIds = [...new Set(userSubmissions.map(s => s.questionId))];
  }

  const enrichedQuestions = questions.map(q => ({
    ...q,
    isBookmarked: bookmarked.includes(q.id),
    isSolved: solvedIds.includes(q.id)
  }));

  res.json({
    questions: enrichedQuestions,
    stats: {
      total: db.codingQuestions.length,
      solved: solvedIds.length,
      easy: db.codingQuestions.filter(q => q.difficulty === 'Easy').length,
      medium: db.codingQuestions.filter(q => q.difficulty === 'Medium').length,
      hard: db.codingQuestions.filter(q => q.difficulty === 'Hard').length
    }
  });
});

// Get single question by ID or slug
router.get('/questions/:idOrSlug', optionalAuth, (req, res) => {
  const db = getDB();
  const q = db.codingQuestions.find(item => item.id === req.params.idOrSlug || item.slug === req.params.idOrSlug);

  if (!q) {
    return res.status(404).json({ message: 'Question not found.' });
  }

  // Return with sample test cases visible
  const safeQ = {
    ...q,
    testCases: q.testCases.slice(0, 2) // reveal 2 sample cases, hide private ones
  };

  let isBookmarked = false;
  let isSolved = false;
  if (req.user) {
    if (db.userProgress[req.user.id]) {
      isBookmarked = (db.userProgress[req.user.id].bookmarkedQuestions || []).includes(q.id);
    }
    const hasAccepted = db.submissions.some(s => s.userId === req.user.id && s.questionId === q.id && s.status === 'Accepted');
    isSolved = hasAccepted;
  }

  res.json({
    question: safeQ,
    isBookmarked,
    isSolved
  });
});

// Run Code (Dry Run / Test)
router.post('/run', async (req, res) => {
  const { questionId, language, code } = req.body;

  if (!questionId || !code) {
    return res.status(400).json({ message: 'questionId and code are required.' });
  }

  const db = getDB();
  const q = db.codingQuestions.find(item => item.id === questionId);

  if (!q) {
    return res.status(404).json({ message: 'Question not found.' });
  }

  try {
    // Run on sample test cases only
    const sampleQuestion = { ...q, testCases: q.testCases.slice(0, 2) };
    const executionResult = await executeCode(language || 'python', code, sampleQuestion);
    res.json(executionResult);
  } catch (err) {
    res.status(500).json({ message: 'Code execution error', error: err.message });
  }
});

// Submit Solution (Full evaluation & XP reward)
router.post('/submit', authenticateToken, async (req, res) => {
  const { questionId, language, code } = req.body;

  if (!questionId || !code) {
    return res.status(400).json({ message: 'questionId and code are required.' });
  }

  const db = getDB();
  const q = db.codingQuestions.find(item => item.id === questionId);

  if (!q) {
    return res.status(404).json({ message: 'Question not found.' });
  }

  try {
    const executionResult = await executeCode(language || 'python', code, q);

    const submission = {
      id: 'sub_' + uuidv4().slice(0, 8),
      userId: req.user.id,
      questionId: q.id,
      questionTitle: q.title,
      difficulty: q.difficulty,
      language: language || 'python',
      code,
      status: executionResult.status,
      runtimeMs: executionResult.runtimeMs,
      memoryKb: executionResult.memoryKb,
      testsPassed: executionResult.testsPassed,
      totalTests: executionResult.totalTests,
      createdAt: new Date().toISOString()
    };

    db.submissions.unshift(submission);

    // If accepted, award points & update progress
    let xpEarned = 0;
    if (executionResult.status === 'Accepted') {
      const user = db.users.find(u => u.id === req.user.id);
      if (user) {
        xpEarned = q.difficulty === 'Hard' ? 100 : (q.difficulty === 'Medium' ? 60 : 40);
        user.xp = (user.xp || 0) + xpEarned;
        user.level = Math.floor(user.xp / 400) + 1;
      }

      if (!db.userProgress[req.user.id]) {
        db.userProgress[req.user.id] = { completedTopics: [], bookmarkedQuestions: [], masteredQuestions: [], stats: {} };
      }
      db.userProgress[req.user.id].stats.questionsSolved = (db.userProgress[req.user.id].stats.questionsSolved || 0) + 1;
    }

    saveDB();

    res.json({
      ...executionResult,
      submissionId: submission.id,
      xpEarned,
      message: executionResult.status === 'Accepted' 
        ? `All ${executionResult.totalTests} test cases passed! +${xpEarned} XP earned!` 
        : `Submission failed. ${executionResult.testsPassed}/${executionResult.totalTests} test cases passed.`
    });
  } catch (err) {
    res.status(500).json({ message: 'Evaluation failed', error: err.message });
  }
});

// Get user submission history
router.get('/submissions', authenticateToken, (req, res) => {
  const db = getDB();
  const userSubmissions = db.submissions.filter(s => s.userId === req.user.id);
  res.json({ submissions: userSubmissions });
});

// Toggle bookmark
router.post('/bookmark', authenticateToken, (req, res) => {
  const { questionId } = req.body;
  const db = getDB();

  if (!db.userProgress[req.user.id]) {
    db.userProgress[req.user.id] = { completedTopics: [], bookmarkedQuestions: [], masteredQuestions: [], stats: {} };
  }

  const bookmarks = db.userProgress[req.user.id].bookmarkedQuestions;
  const idx = bookmarks.indexOf(questionId);
  let isBookmarked = false;

  if (idx === -1) {
    bookmarks.push(questionId);
    isBookmarked = true;
  } else {
    bookmarks.splice(idx, 1);
    isBookmarked = false;
  }

  saveDB();

  res.json({
    message: isBookmarked ? 'Question bookmarked.' : 'Bookmark removed.',
    isBookmarked,
    bookmarkedQuestions: bookmarks
  });
});

module.exports = router;
