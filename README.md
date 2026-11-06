# 🚀 INTERVIEW PREPARATION BOARD — FULL-STACK SAAS PLATFORM

An enterprise-grade, comprehensive full-stack web application designed for engineering students, placement officers, and campus candidates to excel in technical interviews, HR interviews, coding assessments, aptitude rounds, and corporate hiring drives.

---

## 📑 28 Application Pages Index

The application implements all 28 dedicated pages with active routing, responsive layout, and full functionality:

| # | Page Name | Route Key | Key Features & Functional Interactions |
|---|---|---|---|
| **1** | **Landing Page** | `landing` | Modern SaaS hero section, stats ticker, interactive feature tour, testimonials, FAQ, and CTA |
| **2** | **Login Page** | `login` | Email/password login, remember me, 1-click Demo Student & Admin buttons, Google Sign-in |
| **3** | **Signup / Register Page** | `register` | Student/Admin role selection, password strength meter, college & degree profile setup |
| **4** | **Forgot Password Page** | `forgot-password` | Security token generation with automated pre-fill for local testing |
| **5** | **Reset Password Page** | `reset-password` | Secure token verification, new password with dynamic strength validation |
| **6** | **Student Dashboard** | `dashboard` | Dynamic time-of-day greeting, streak counter, KPI stat cards, weekly activity chart, upcoming interviews |
| **7** | **Learning Roadmap** | `roadmap` | All 13 categories, topics, subtopics, theory, code snippets with 1-click copy, practice Q&A, and progress tracking |
| **8** | **Coding Practice IDE** | `coding` | LeetCode-style workspace, Python/Java/C++/C templates, test case runner, submission history, bookmarks |
| **9** | **Coding Question Details** | `coding-question` | Deep editorial breakdown, complexity analysis (Time & Space), sample I/O, company tags |
| **10** | **AI Mock Interview** | `interview` | Text-to-Speech (TTS) questions, speech recognition (STT) answers, STAR scoring, real-time timer |
| **11** | **Interview History** | `interview-history` | Past session archives, scores breakdown (Accuracy, Clarity, Problem Solving), strengths, weaknesses, tips, print report |
| **12** | **Resume Builder** | `resume` | Side-by-side ATS resume editor, live preview, auto-fill computer science profile, ATS score analysis |
| **13** | **Resume Live Preview** | `resume-preview` | Full-page printable ATS layout, Modern/Classic/Minimal themes, 1-click PDF download via `window.print()` |
| **14** | **Company Preparation** | `companies` | 10 tech giants (TCS, Infosys, Amazon, Google, Microsoft, Wipro, Accenture, Cognizant, Capgemini, Deloitte) |
| **15** | **Aptitude Tests** | `aptitude` | 10-minute timer, question navigation palette, negative marking toggle, automatic scoring |
| **16** | **Quiz Results** | `quiz-results` | Scorecard, percentile ranking, question-by-question review with detailed formula explanations |
| **17** | **Interview Question Bank** | `questions` | Architectural & behavioral questions, company tags, keyword search, mark as mastered (+15 XP) |
| **18** | **Study Planner** | `planner` | Daily tasks, priorities (High/Med/Low), category filtering, completion checkmarks (+20 XP) |
| **19** | **Interview Calendar** | `calendar` | Interactive monthly grid, date selector, day agenda, scheduled mock interviews, add event modal |
| **20** | **Leaderboard** | `leaderboard` | Real-time candidate rankings, XP points, rank badges (#1 Crown, #2 & #3 Medals), badge showcase |
| **21** | **Notifications Center** | `notifications` | Notification center, filters (Unread, Announcements, Achievements), mark as read, timestamps |
| **22** | **Student Profile** | `profile` | Edit personal details, CGPA, target companies, technical skills bio, email verification |
| **23** | **Settings** | `settings` | Account goals, change password, Judge0 & AI API key configs, Dark/Light theme, Danger Zone |
| **24** | **Admin Dashboard** | `admin-dashboard` | Placement administration overview, registered candidates, submissions count, system telemetry |
| **25** | **User Management (Admin)** | `admin-users` | Candidate directory, search, add student/officer, edit credentials, remove account |
| **26** | **Question Management (Admin)** | `admin-questions` | Add/delete LeetCode-style coding challenges, aptitude MCQs, and interview questions |
| **27** | **Learning Content Management** | `admin-content` | Overview of all 13 curriculum tracks, topic counts, curriculum hierarchy |
| **28** | **Placement Analytics (Admin)** | `admin-analytics` | Language usage shares (Python, Java, C++, C), performance score percentiles, weekly activity |

---

## 📚 13 Complete Learning Categories (Phase 6)

Every category contains topics, subtopics, theory explanations, code/formula examples, and practice interview questions with answers:

1. **C Programming** (`prog_c`): Basics & Syntax, Pointers & Dynamic Memory Allocation (`malloc`/`free`), Structures, Unions & File I/O.
2. **C++** (`prog_cpp`): Classes, Objects & Virtual Functions (vtable/vptr), Standard Template Library (STL containers & algorithms), Modern C++ (Smart pointers `unique_ptr`/`shared_ptr`, move semantics, lambdas).
3. **Java** (`prog_java`): JVM Architecture & Memory Areas (Heap, Stack, Metaspace, GC), Collections Framework & Streams, Multithreading & Concurrency (`synchronized`, `volatile`, `ExecutorService`).
4. **Python** (`prog_python`): Advanced Idioms, Decorators, Generators & Context Managers, Memory Model, GIL, and OOPs in Python.
5. **DSA** (`cs_dsa`): Arrays, Two Pointers & Sliding Window, Binary Trees, BST, DFS, BFS & Shortest Paths (Dijkstra, Bellman-Ford), Dynamic Programming & Memoization (Knapsack, LCS, LIS).
6. **DBMS** (`cs_dbms`): ACID Properties, Concurrency Control, Relational Normalization (1NF to BCNF), B+ Tree Indexing & 2-Phase Locking.
7. **Operating Systems** (`cs_os`): Processes, Threads & Synchronization (Mutex/Semaphore), Deadlocks (4 Coffman conditions, Banker's algorithm), Virtual Memory, Paging & Page Replacement (FIFO, LRU).
8. **Computer Networks** (`cs_networks`): OSI vs TCP/IP Models, TCP 3-Way Handshake, Flow & Congestion Control, Subnetting, DNS, and TLS/HTTPS Security Handshake.
9. **OOPs** (`cs_oops`): 4 Pillars of OOPs (Encapsulation, Abstraction, Inheritance, Polymorphism), SOLID Design Principles, and Design Patterns (Singleton, Factory, Observer).
10. **SQL** (`cs_sql`): Multi-Table Joins (Inner, Left, Right, Full, Cross, Self), Aggregations (`GROUP BY`, `HAVING`), Window Functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LEAD`, `LAG`), CTEs.
11. **Aptitude** (`prep_aptitude`): Percentages, Profit & Loss, Simple & Compound Interest, Time & Work, Pipes & Cisterns, Relative Speed & Trains, Permutations, Combinations & Probability.
12. **Logical Reasoning** (`prep_logical`): Syllogisms & Deductive Logic, Blood Relations & Family Trees, Linear & Circular Seating Arrangements, Coding-Decoding, Series Completion.
13. **Verbal Ability** (`prep_verbal`): Sentence Correction, Subject-Verb Agreement, Error Spotting, Reading Comprehension, Para Jumbles, Synonyms & Antonyms.

---

## 🏢 10 Top Companies Preparation (Phase 10)

Comprehensive preparation kits for:
1. **TCS** (Ninja 3.36 LPA, Digital 7.0 LPA, Prime 9.0-11.5 LPA)
2. **Infosys** (System Engineer 3.6 LPA, Specialist Programmer 9.5 LPA, DSE 6.25 LPA)
3. **Amazon** (SDE-1 28-45 LPA CTC, Bar Raiser round, Leadership Principles)
4. **Google** (SWE L3 35-55 LPA CTC, System Design & Clean Code)
5. **Microsoft** (Software Engineer 40-50 LPA CTC, DSA & Low-Level Design)
6. **Wipro** (Elite 3.5 LPA, Turbo 6.5 LPA, Automated AI Essay Writing)
7. **Accenture** (Associate Software Engineer 4.5 LPA, Advanced ASE 6.5 LPA)
8. **Cognizant** (GenC 4.0 LPA, GenC Elevate 4.25 LPA, GenC Next 6.75 LPA)
9. **Capgemini** (Analyst 4.25 LPA, Senior Analyst 7.5 LPA, Game-Based Aptitude)
10. **Deloitte** (Analyst 7.6 LPA, Consultant 11-13 LPA, Just-A-Minute JAM Round)

Each profile includes:
- Company introduction & overview
- Cadres & CTC packages
- Selection process rounds breakdown
- Eligibility criteria & backlogs policy
- Frequently asked technical interview questions with model answers
- Company-specific aptitude questions
- HR interview behavioral questions with STAR responses
- Topper preparation tips
- Interactive 3-question timed practice test with instant scoring and XP rewards

---

## 💻 Coding Practice IDE (Phase 7)

- **10 Core Questions**: Two Sum, Reverse Linked List, Merge Two Sorted Lists, Longest Substring Without Repeating Characters, Trapping Rain Water, Best Time to Buy and Sell Stock, Valid Parentheses, Maximum Subarray (Kadane's), Container With Most Water, 3Sum.
- **Languages**: Python, Java, C++, C with starter templates.
- **Execution**: Run code against sample tests, submit against hidden test cases.
- **Safety**: Safe local process runner with execution timeout, memory profiling, and fallback simulated analyzer. Does not execute untrusted commands on the main process.

---

## 🎙️ AI Mock Interview Simulation (Phase 8)

- **Interview Types**: Technical, HR, Behavioral, Company-Specific.
- **Speech Integration**:
  - Web Speech API for real-time speech-to-text voice input.
  - SpeechSynthesis browser engine for voice question prompts.
- **Evaluation**: Real-time scoring out of 100 with 4 sub-scores (Accuracy, Clarity, Problem-Solving, Completeness), strengths, weaknesses, model answer, and actionable growth tips.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `student@interviewprep.com` | `Student@123` |
| **Admin** | `admin@interviewprep.com` | `Admin@123` |

*(One-click demo buttons are available on the Login page for effortless evaluation).*

---

## 🛠️ Architecture & Tech Stack

- **Client**: React 18, Vite, Tailwind CSS, Lucide React icons, Canvas Confetti.
- **Server**: Node.js, Express, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), UUID.
- **Database**: Persistent JSON database stored in `server/data/db.json` with transactional read/write caching.
- **Testing & Tooling**: Vite build engine, PostCSS, Autoprefixer.

---

## 🚀 Installation & Local Execution

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24.15.0).
- **npm** v9+.

### 2. Install Dependencies (if not already installed)
\`\`\`bash
# Install root dependencies (if any)
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
\`\`\`

### 3. Start Both Backend and Frontend in One Command
\`\`\`bash
node start.js
\`\`\`
This concurrently boots:
- Backend Express server on **`http://localhost:5000`**
- Frontend Vite development server on **`http://localhost:3000`**

### 4. Or Start in Separate Terminals
**Terminal 1 (Backend Server)**:
\`\`\`bash
cd server
npm start
\`\`\`

**Terminal 2 (Frontend Client)**:
\`\`\`bash
cd client
npm run dev
\`\`\`

Open **`http://localhost:3000`** in any modern web browser.

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `server/.env`:
\`\`\`env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_interview_prep_board_key_2026_xyz

# Optional External API Keys:
RAPIDAPI_JUDGE0_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
\`\`\`

---

## 🎓 College Viva & Project Defense Guide

When demonstrating this project for academic viva or recruitment portfolios:
1. **Highlight the Architecture**: Point out the clean decoupling between the Vite/React frontend and Express REST API.
2. **Showcase Authentication**: Demonstrate role-based access control (Student vs Admin views) and password hashing with salt.
3. **Demonstrate All 28 Pages**: Use the navbar, user menu, dashboard cards, and admin tabs to walk examiners through every module.
4. **Demonstrate AI Mock Interview**: Show both text and microphone speech input, and explain the heuristic scoring rubric (STAR framework).
5. **Demonstrate the Code Execution**: Run the Two Sum algorithm in Python and demonstrate test case verification.
6. **Demonstrate ATS Resume Preview**: Switch between Modern, Classic, and Minimal templates and trigger the print/PDF download.
7. **Demonstrate Admin Powers**: Show how administrators can broadcast bulletins to all students and curate questions dynamically.

---
*Developed autonomously by Antigravity Senior Full-Stack Engineering Agent.*
