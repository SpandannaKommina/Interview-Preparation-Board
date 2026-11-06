const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../db/database');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

// Get all roadmap categories with user progress
router.get('/', optionalAuth, (req, res) => {
  const db = getDB();
  const roadmaps = db.roadmaps;

  let completedTopics = [];
  if (req.user && db.userProgress[req.user.id]) {
    completedTopics = db.userProgress[req.user.id].completedTopics || [];
  }

  // Calculate statistics per category
  const categoriesMap = {};
  let totalTopicsCount = 0;

  roadmaps.forEach(cat => {
    let catTotal = 0;
    let catCompleted = 0;

    (cat.topics || []).forEach(top => {
      catTotal++;
      totalTopicsCount++;
      if (completedTopics.includes(top.id)) {
        catCompleted++;
      }
    });

    categoriesMap[cat.id] = {
      ...cat,
      totalTopics: catTotal,
      completedTopicsCount: catCompleted,
      completionPct: catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0
    };
  });

  const overallCompleted = completedTopics.length;
  const overallPct = totalTopicsCount > 0 ? Math.round((overallCompleted / totalTopicsCount) * 100) : 0;

  res.json({
    categories: Object.values(categoriesMap),
    completedTopics,
    stats: {
      totalTopics: totalTopicsCount,
      completedTopics: overallCompleted,
      completionPct: overallPct
    }
  });
});

// Toggle topic completion
router.post('/toggle-topic', authenticateToken, (req, res) => {
  const { topicId } = req.body;
  if (!topicId) {
    return res.status(400).json({ message: 'topicId is required.' });
  }

  const db = getDB();
  if (!db.userProgress[req.user.id]) {
    db.userProgress[req.user.id] = {
      completedTopics: [],
      bookmarkedQuestions: [],
      masteredQuestions: [],
      stats: { questionsSolved: 0, learningHours: 0, testsTaken: 0, mockInterviewsCount: 0, overallCompletionPct: 0 }
    };
  }

  const userProg = db.userProgress[req.user.id];
  const index = userProg.completedTopics.indexOf(topicId);
  let isNowCompleted = false;

  if (index === -1) {
    userProg.completedTopics.push(topicId);
    isNowCompleted = true;

    // Award +30 XP
    const user = db.users.find(u => u.id === req.user.id);
    if (user) {
      user.xp = (user.xp || 0) + 30;
      user.level = Math.floor(user.xp / 400) + 1;
    }
  } else {
    userProg.completedTopics.splice(index, 1);
    isNowCompleted = false;
  }

  // Recalculate overall completion
  let totalTopics = 0;
  db.roadmaps.forEach(r => {
    totalTopics += (r.topics || []).length;
  });
  userProg.stats.overallCompletionPct = totalTopics > 0 
    ? Math.round((userProg.completedTopics.length / totalTopics) * 100) 
    : 0;

  saveDB();

  res.json({
    message: isNowCompleted ? 'Topic marked as completed! (+30 XP)' : 'Topic marked as uncompleted.',
    isCompleted: isNowCompleted,
    completedTopics: userProg.completedTopics,
    overallCompletionPct: userProg.stats.overallCompletionPct
  });
});

module.exports = router;
