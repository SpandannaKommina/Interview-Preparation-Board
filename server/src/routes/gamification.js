const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');
const { optionalAuth } = require('../middleware/auth');

router.get('/leaderboard', optionalAuth, (req, res) => {
  const db = getDB();

  // Sort users by XP descending
  const sortedUsers = [...db.users]
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .map((u, index) => {
      const prog = db.userProgress[u.id] || { stats: {} };
      return {
        rank: index + 1,
        id: u.id,
        fullName: u.fullName,
        avatar: u.avatar,
        college: u.college,
        xp: u.xp || 0,
        level: u.level || 1,
        streakDays: u.streakDays || 1,
        questionsSolved: prog.stats?.questionsSolved || 0,
        testsTaken: prog.stats?.testsTaken || 0,
        isCurrentUser: req.user ? req.user.id === u.id : false
      };
    });

  // Calculate badges for current user
  let unlockedBadgeIds = ['badge_first_code'];
  if (req.user) {
    const prog = db.userProgress[req.user.id] || { stats: {} };
    const solved = prog.stats?.questionsSolved || 0;
    const streak = db.users.find(u => u.id === req.user.id)?.streakDays || 0;
    const mockCount = prog.stats?.mockInterviewsCount || 0;

    if (solved >= 10) unlockedBadgeIds.push('badge_code_warrior');
    if (streak >= 7) unlockedBadgeIds.push('badge_streak_7');
    if (mockCount >= 1) unlockedBadgeIds.push('badge_interview_ready');
    if (prog.stats?.testsTaken >= 1) unlockedBadgeIds.push('badge_aptitude_master');
  }

  const allBadges = db.badges.map(b => ({
    ...b,
    isUnlocked: unlockedBadgeIds.includes(b.id)
  }));

  res.json({
    leaderboard: sortedUsers,
    badges: allBadges
  });
});

module.exports = router;
