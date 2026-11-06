const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDB, saveDB } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

// ATS Analyzer Engine
function analyzeResumeATS(resumeData) {
  let score = 50; // base score
  const feedback = [];
  const suggestions = [];

  const { personalInfo, careerObjective, education, skills, experience, projects, certifications } = resumeData;

  // 1. Personal Info check
  if (personalInfo?.fullName && personalInfo?.email && personalInfo?.phone) {
    score += 8;
    feedback.push('Complete personal contact details found.');
  } else {
    suggestions.push('Ensure full name, professional email, phone number, and location are fully specified.');
  }

  if (personalInfo?.linkedin || personalInfo?.github) {
    score += 5;
    feedback.push('Included professional portfolio/GitHub/LinkedIn links.');
  } else {
    suggestions.push('Add active GitHub and LinkedIn profile URLs to establish credibility.');
  }

  // 2. Career Objective check
  if (careerObjective && careerObjective.length > 50) {
    score += 7;
    feedback.push('Clear, concise career summary/objective present.');
  } else {
    suggestions.push('Add a 2-3 sentence career summary tailored to your target engineering domain.');
  }

  // 3. Skills check
  const skillCount = (skills?.languages?.length || 0) + (skills?.frameworks?.length || 0) + (skills?.tools?.length || 0);
  if (skillCount >= 8) {
    score += 10;
    feedback.push(`Extensive technical skills detected (${skillCount} keywords identified).`);
  } else {
    suggestions.push('Expand technical skills section with relevant languages, frameworks, and developer tools.');
  }

  // 4. Experience & Projects Action Verbs
  const actionVerbs = ['developed', 'engineered', 'architected', 'implemented', 'designed', 'optimized', 'reduced', 'increased', 'accelerated', 'built', 'created'];
  let actionVerbCount = 0;
  let metricsCount = 0;

  const allBullets = [
    ...(experience || []).flatMap(e => e.bullets || []),
    ...(projects || []).flatMap(p => p.bullets || [])
  ];

  allBullets.forEach(b => {
    const lower = b.toLowerCase();
    actionVerbs.forEach(v => {
      if (lower.includes(v)) actionVerbCount++;
    });
    // Check numbers/percentages
    if (/\d+%|\d+x|\$\d+|\d+ms|\d+k/i.test(b)) {
      metricsCount++;
    }
  });

  if (actionVerbCount >= 4) {
    score += 10;
    feedback.push('Strong action verbs used in experience/project bullet points.');
  } else {
    suggestions.push('Start every bullet point with a powerful past-tense action verb (e.g., "Engineered", "Optimized", "Spearheaded").');
  }

  if (metricsCount >= 2) {
    score += 10;
    feedback.push('Quantifiable metrics and business outcomes identified (e.g. latency reductions, percentage boosts).');
  } else {
    suggestions.push('Add quantifiable metrics to your project bullets (e.g., "reduced latency by 35%", "handled 1,000+ daily requests").');
  }

  score = Math.min(96, Math.max(40, score));

  let verdict = 'Needs Improvement';
  if (score >= 85) verdict = 'Excellent ATS Score';
  else if (score >= 70) verdict = 'Good ATS Alignment';

  return {
    score,
    verdict,
    feedback,
    suggestions
  };
}

// Get user resumes
router.get('/', authenticateToken, (req, res) => {
  const db = getDB();
  const resumes = (db.resumes || []).filter(r => r.userId === req.user.id);
  res.json({ resumes });
});

// Get resume by ID
router.get('/:id', authenticateToken, (req, res) => {
  const db = getDB();
  const resume = (db.resumes || []).find(r => r.id === req.params.id && r.userId === req.user.id);

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found.' });
  }

  res.json({ resume });
});

// Save or Update Resume
router.post('/', authenticateToken, (req, res) => {
  const db = getDB();
  const resumeData = req.body;

  const atsAnalysis = analyzeResumeATS(resumeData);

  let existingIndex = -1;
  if (resumeData.id) {
    existingIndex = (db.resumes || []).findIndex(r => r.id === resumeData.id && r.userId === req.user.id);
  }

  const updatedResume = {
    ...resumeData,
    id: existingIndex >= 0 ? db.resumes[existingIndex].id : 'res_' + uuidv4().slice(0, 8),
    userId: req.user.id,
    atsScore: atsAnalysis.score,
    atsReview: atsAnalysis,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    db.resumes[existingIndex] = updatedResume;
  } else {
    if (!db.resumes) db.resumes = [];
    db.resumes.push(updatedResume);

    // Award +50 XP for creating a resume
    const user = db.users.find(u => u.id === req.user.id);
    if (user) {
      user.xp = (user.xp || 0) + 50;
    }
  }

  saveDB();

  res.json({
    message: 'Resume saved and ATS analyzed successfully!',
    resume: updatedResume
  });
});

// Delete Resume
router.delete('/:id', authenticateToken, (req, res) => {
  const db = getDB();
  const index = (db.resumes || []).findIndex(r => r.id === req.params.id && r.userId === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Resume not found.' });
  }

  db.resumes.splice(index, 1);
  saveDB();

  res.json({ message: 'Resume deleted successfully.' });
});

// Direct ATS analysis endpoint
router.post('/analyze', authenticateToken, (req, res) => {
  const analysis = analyzeResumeATS(req.body);
  res.json(analysis);
});

module.exports = router;
