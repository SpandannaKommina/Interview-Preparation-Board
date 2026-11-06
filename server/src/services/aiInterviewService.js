const https = require('https');

const QUESTION_CATALOG = {
  'Technical Interview': {
    'Full Stack Developer': [
      {
        id: 'tech_fs_1',
        question: 'Explain how the Virtual DOM works in React and how reconciliation optimizes browser rendering performance.',
        hint: 'Mention tree diffing, heuristic assumptions, fiber architecture, and batching.',
        category: 'Frontend & Architecture'
      },
      {
        id: 'tech_fs_2',
        question: 'What are the trade-offs between SQL (Relational) and NoSQL (Document/Key-Value) databases for a high-traffic e-commerce platform?',
        hint: 'Discuss ACID vs BASE, schema rigidity, horizontal scaling, joins, and read/write patterns.',
        category: 'Database & Systems'
      },
      {
        id: 'tech_fs_3',
        question: 'How do you secure REST APIs against common vulnerabilities like SQL Injection, XSS, and CSRF?',
        hint: 'Mention prepared statements, input sanitization, HTTP-only SameSite cookies, and CORS.',
        category: 'Security & Web'
      },
      {
        id: 'tech_fs_4',
        question: 'Describe how Node.js event loop handles asynchronous non-blocking I/O with libuv.',
        hint: 'Explain microtasks, timers, poll phase, check phase, and worker thread pool.',
        category: 'Backend & Runtime'
      },
      {
        id: 'tech_fs_5',
        question: 'What is caching and how would you implement a Redis caching layer for heavy database queries?',
        hint: 'Discuss cache-aside pattern, TTL, cache invalidation, and cache stampede protection.',
        category: 'Performance'
      }
    ],
    'SDE 1': [
      {
        id: 'tech_sde_1',
        question: 'Walk me through how a Hash Table handles hash collisions, comparing Chaining with Open Addressing.',
        hint: 'Mention average vs worst-case time complexity, load factor, and resize/rehash.',
        category: 'Data Structures'
      },
      {
        id: 'tech_sde_2',
        question: 'Explain the difference between Mutex and Semaphore. In what scenarios would you choose one over the other?',
        hint: 'Mention thread ownership, binary vs counting semaphore, and critical section protection.',
        category: 'Operating Systems'
      },
      {
        id: 'tech_sde_3',
        question: 'How does the TCP 3-way handshake work and why is a 2-way handshake insufficient for reliable connections?',
        hint: 'Explain SYN, SYN-ACK, ACK, sequence numbers, and prevention of delayed duplicate packets.',
        category: 'Networks'
      },
      {
        id: 'tech_sde_4',
        question: 'Compare Dijkstra algorithm and Bellman-Ford algorithm for finding shortest paths in graphs.',
        hint: 'Discuss greedy vs dynamic programming approach and negative edge weights.',
        category: 'Algorithms'
      }
    ],
    'Data Analyst': [
      {
        id: 'tech_da_1',
        question: 'Explain the difference between WHERE and HAVING clauses in SQL with a realistic business example.',
        hint: 'Discuss row-level filtering vs aggregated group-level filtering.',
        category: 'SQL'
      },
      {
        id: 'tech_da_2',
        question: 'What are SQL Window Functions (like ROW_NUMBER, RANK, DENSE_RANK) and when would you use them?',
        hint: 'Explain PARTITION BY and ORDER BY clauses without collapsing grouped rows.',
        category: 'Data Analysis'
      }
    ]
  },
  'HR Interview': {
    default: [
      {
        id: 'hr_1',
        question: 'Tell me about yourself, your academic background, and what inspired you to pursue software engineering.',
        hint: 'Keep it structured: Past (foundation) -> Present (skills/projects) -> Future (why this role).',
        category: 'Self Introduction'
      },
      {
        id: 'hr_2',
        question: 'Describe a time when you had to work with a difficult team member or resolved a conflicting point of view.',
        hint: 'Use the STAR method: Situation, Task, Action taken with empathy, and positive Result.',
        category: 'Conflict Resolution'
      },
      {
        id: 'hr_3',
        question: 'What is your greatest technical or personal failure, and what valuable lessons did you learn from it?',
        hint: 'Be genuine, focus on accountability and the corrective growth mindset you adopted.',
        category: 'Growth Mindset'
      },
      {
        id: 'hr_4',
        question: 'Where do you see yourself in 3 to 5 years, and how does this role align with your aspirations?',
        hint: 'Highlight technical depth, team mentorship, and contributing to high-impact products.',
        category: 'Career Vision'
      },
      {
        id: 'hr_5',
        question: 'Why should we hire you over other qualified candidates applying for this position?',
        hint: 'Combine technical competency with passion, adaptability, and proactive problem-solving.',
        category: 'Value Proposition'
      }
    ]
  },
  'Behavioral Interview': {
    default: [
      {
        id: 'beh_1',
        question: 'Give an example of a situation where you had to adapt quickly to unexpected changes in project requirements.',
        hint: 'Highlight flexibility, agile mindset, clear stakeholder communication, and swift execution.',
        category: 'Adaptability'
      },
      {
        id: 'beh_2',
        question: 'Tell me about a project where you took initiative beyond what was formally assigned to you.',
        hint: 'Demonstrate leadership, ownership, identifying gaps, and delivering quantifiable value.',
        category: 'Ownership'
      },
      {
        id: 'beh_3',
        question: 'Describe a situation where you had to meet a tight deadline under immense pressure.',
        hint: 'Focus on task prioritization, time management, scoping down, and delivering quality.',
        category: 'Pressure Handling'
      }
    ]
  },
  'Coding Interview': {
    default: [
      {
        id: 'code_int_1',
        question: 'How would you find the median of two sorted arrays of different sizes in O(log(min(m, n))) time complexity?',
        hint: 'Explain binary search on the partition of the smaller array.',
        category: 'Binary Search'
      },
      {
        id: 'code_int_2',
        question: 'Explain how you would design an autocomplete system that suggests top 5 queries as the user types.',
        hint: 'Discuss Trie data structure, frequency nodes, caching, and serialization.',
        category: 'System Design & DSA'
      }
    ]
  },
  'Company-specific Interview': {
    default: [
      {
        id: 'comp_1',
        question: 'What excites you specifically about our technology stack, engineering culture, and recent innovations?',
        hint: 'Show thorough research about the company products, mission, and tech challenges.',
        category: 'Company Culture'
      },
      {
        id: 'comp_2',
        question: 'How do you approach learning a new programming language or framework required for our client projects?',
        hint: 'Explain reading official docs, building proof-of-concept projects, and learning by debugging.',
        category: 'Continuous Learning'
      }
    ]
  }
};

function getQuestions(interviewType, role, count = 3) {
  let source = null;
  if (QUESTION_CATALOG[interviewType]) {
    source = QUESTION_CATALOG[interviewType][role] || QUESTION_CATALOG[interviewType]['default'] || QUESTION_CATALOG['Technical Interview']['Full Stack Developer'];
  } else {
    source = QUESTION_CATALOG['Technical Interview']['Full Stack Developer'];
  }

  // Shuffle and slice requested count
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Evaluate answer
function evaluateAnswer(questionObj, userAnswer, role) {
  const answer = (userAnswer || '').trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  if (wordCount < 10) {
    return {
      score: 35,
      breakdown: { accuracy: 40, clarity: 40, problemSolving: 30, completeness: 30 },
      strengths: ['Attempted to provide a response.'],
      weaknesses: ['Response is too brief to evaluate in depth. Interviewers expect detailed structured reasoning.'],
      modelAnswer: `A comprehensive answer for this question would explain: ${questionObj.hint || 'the core principles, edge cases, and real-world examples.'}`,
      tips: 'Aim for at least 3-4 structured sentences. State the definition, explain the underlying mechanism, and give a concrete example.'
    };
  }

  // Heuristic analysis
  let accuracy = 70;
  let clarity = 75;
  let problemSolving = 72;
  let completeness = 70;
  const strengths = [];
  const weaknesses = [];

  // Length check
  if (wordCount >= 60) {
    completeness += 15;
    strengths.push('Good depth and thoroughness in explanation.');
  } else if (wordCount >= 30) {
    completeness += 8;
  } else {
    weaknesses.push('Could provide more comprehensive detail and examples.');
  }

  // Check structure indicators
  const structureWords = ['first', 'second', 'because', 'for example', 'such as', 'trade-off', 'furthermore', 'however', 'result', 'finally'];
  const matchedStructure = structureWords.filter(w => answer.toLowerCase().includes(w));
  if (matchedStructure.length >= 2) {
    clarity += 12;
    strengths.push('Well-structured articulation with clear connectors.');
  }

  // Check technical depth / STAR indicators
  const techIndicators = ['complexity', 'o(1)', 'o(n)', 'memory', 'performance', 'database', 'latency', 'scale', 'architecture', 'state', 'component', 'server', 'client', 'cache'];
  const starIndicators = ['situation', 'task', 'action', 'result', 'team', 'challenge', 'learned', 'improved', 'achieved', 'metric'];

  const isHR = questionObj.category === 'Self Introduction' || questionObj.category === 'Conflict Resolution' || questionObj.category === 'Behavioral';
  
  if (isHR) {
    const starMatches = starIndicators.filter(w => answer.toLowerCase().includes(w));
    if (starMatches.length >= 3) {
      problemSolving += 15;
      accuracy += 10;
      strengths.push('Effectively applied situational narrative / STAR principles.');
    } else {
      weaknesses.push('Consider framing your story explicitly around the STAR framework (Situation, Task, Action, Result).');
    }
  } else {
    const techMatches = techIndicators.filter(w => answer.toLowerCase().includes(w));
    if (techMatches.length >= 2) {
      accuracy += 15;
      problemSolving += 12;
      strengths.push('Strong technical vocabulary and awareness of engineering trade-offs.');
    } else {
      weaknesses.push('Add specific technical terminology (e.g. time/space complexities, protocols, or concrete design patterns).');
    }
  }

  // Cap values between 40 and 96
  accuracy = Math.min(96, Math.max(45, accuracy));
  clarity = Math.min(96, Math.max(45, clarity));
  problemSolving = Math.min(96, Math.max(45, problemSolving));
  completeness = Math.min(96, Math.max(45, completeness));

  const overallScore = Math.round((accuracy * 0.35) + (clarity * 0.25) + (problemSolving * 0.25) + (completeness * 0.15));

  if (strengths.length === 0) {
    strengths.push('Addressed the question prompt directly.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Include a specific production or personal project example to make your answer unforgettable.');
  }

  const modelAnswer = `Recommended Structure:\n1. Direct Thesis: Define the primary concept clearly in 1-2 sentences.\n2. Core Mechanism: ${questionObj.hint || 'Walk through how it works internally.'}\n3. Trade-offs / Edge cases: Highlight when to choose this approach over alternatives and note any performance implications.`;

  return {
    score: overallScore,
    breakdown: { accuracy, clarity, problemSolving, completeness },
    strengths,
    weaknesses,
    modelAnswer,
    tips: isHR 
      ? 'Always conclude behavioral answers with measurable results or positive reflections.'
      : 'Always mention Time and Space complexity or scalability implications during technical interviews.'
  };
}

module.exports = {
  getQuestions,
  evaluateAnswer
};
