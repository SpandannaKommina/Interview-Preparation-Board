const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDB, saveDB } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

// Get tasks for user
router.get('/', authenticateToken, (req, res) => {
  const db = getDB();
  const tasks = (db.tasks || []).filter(t => t.userId === req.user.id);

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    tasks,
    stats: {
      total,
      completed,
      pending: total - completed,
      progressPct
    }
  });
});

// Create task
router.post('/', authenticateToken, (req, res) => {
  const { title, category = 'General', dueDate, priority = 'Medium' } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const db = getDB();
  const newTask = {
    id: 'task_' + uuidv4().slice(0, 8),
    userId: req.user.id,
    title,
    category,
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  };

  if (!db.tasks) db.tasks = [];
  db.tasks.unshift(newTask);
  saveDB();

  res.status(201).json({
    message: 'Task added successfully.',
    task: newTask
  });
});

// Toggle task completion
router.put('/:id/toggle', authenticateToken, (req, res) => {
  const db = getDB();
  const task = (db.tasks || []).find(t => t.id === req.params.id && t.userId === req.user.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.completed = !task.completed;

  // If completed, award +20 XP
  if (task.completed) {
    const user = db.users.find(u => u.id === req.user.id);
    if (user) {
      user.xp = (user.xp || 0) + 20;
    }
  }

  saveDB();

  res.json({
    message: task.completed ? 'Task completed! (+20 XP)' : 'Task marked as pending.',
    task
  });
});

// Delete task
router.delete('/:id', authenticateToken, (req, res) => {
  const db = getDB();
  const index = (db.tasks || []).findIndex(t => t.id === req.params.id && t.userId === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  db.tasks.splice(index, 1);
  saveDB();

  res.json({ message: 'Task deleted successfully.' });
});

module.exports = router;
