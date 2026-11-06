import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Sparkles, Plus, Trash2, CheckCircle2, 
  AlertCircle, Eye, Printer, Save, RefreshCw, Star, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ResumePage({ setActivePage }) {
  const { user } = useAuth();
  const [template, setTemplate] = useState('modern'); // 'modern' | 'classic' | 'executive'
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [atsScore, setAtsScore] = useState(88);
  const [atsFeedback, setAtsFeedback] = useState([]);
  const [atsSuggestions, setAtsSuggestions] = useState([]);

  // Resume Form Data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.fullName || 'Alex Vance',
    email: user?.email || 'alex.vance@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Bangalore, India / Remote',
    linkedin: 'linkedin.com/in/alexvance',
    github: 'github.com/alexvance',
    portfolio: 'alexvance.dev'
  });

  const [careerObjective, setCareerObjective] = useState(
    'Motivated Computer Science graduate with strong foundations in Data Structures, Algorithms, Full-Stack Architecture, and Cloud Systems, seeking an SDE-1 role to build high-scale, resilient user-facing products.'
  );

  const [education, setEducation] = useState([
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution: 'Indian Institute of Technology / Apex Institute of Technology',
      year: '2023 - 2027',
      score: 'CGPA: 8.8 / 10.0'
    }
  ]);

  const [skills, setSkills] = useState({
    languages: 'Python, Java, C++, JavaScript, TypeScript, SQL',
    frameworks: 'React, Node.js, Express, Next.js, Tailwind CSS, FastAPI',
    tools: 'Git, Docker, PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Linux'
  });

  const [experience, setExperience] = useState([
    {
      role: 'Software Engineering Intern',
      company: 'CloudPulse Technologies',
      duration: 'Jun 2025 - Aug 2025',
      location: 'Remote',
      bullets: [
        'Developed RESTful microservices in Node.js & Redis, reducing API response latency by 34% across 100k daily queries.',
        'Engineered automated CI/CD pipeline using GitHub Actions, cutting staging deployment duration from 25 to 6 minutes.'
      ]
    }
  ]);

  const [projects, setProjects] = useState([
    {
      title: 'Real-Time Collaborative Code Editor',
      techStack: 'React, Node.js, WebSockets, Redis',
      liveUrl: 'https://collab-code.demo.app',
      bullets: [
        'Built multi-cursor collaborative code editor supporting 50+ concurrent users with sub-50ms synchronization latency.',
        'Implemented operational transformation algorithm to handle concurrent edits without conflicts or text corruption.'
      ]
    },
    {
      title: 'Distributed Asynchronous Task Queue',
      techStack: 'Python, FastAPI, Celery, Redis',
      liveUrl: 'https://tasks.demo.app',
      bullets: [
        'Architected background worker system processing 5,000+ daily scheduled jobs with automatic retry queues.',
        'Integrated Prometheus telemetry and Grafana dashboards for real-time monitoring of queue lag and failure rates.'
      ]
    }
  ]);

  const [certifications, setCertifications] = useState([
    'AWS Certified Cloud Practitioner (2025)',
    'Meta Front-End Developer Professional Certificate'
  ]);

  const [achievements, setAchievements] = useState([
    'Global Rank 342 in Google Kick Start / LeetCode Knight (Rating: 1940+)',
    'Winner of Smart India Hackathon College Round 2025'
  ]);

  // Run ATS scan on change
  const runATSScan = async () => {
    try {
      const payload = {
        personalInfo,
        careerObjective,
        education,
        skills: {
          languages: skills.languages.split(',').map(s => s.trim()).filter(Boolean),
          frameworks: skills.frameworks.split(',').map(s => s.trim()).filter(Boolean),
          tools: skills.tools.split(',').map(s => s.trim()).filter(Boolean)
        },
        experience,
        projects,
        certifications,
        achievements
      };
      const res = await api.analyzeResumeATS(payload);
      setAtsScore(res.score || 85);
      setAtsFeedback(res.feedback || []);
      setAtsSuggestions(res.suggestions || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runATSScan();
  }, [careerObjective, skills, experience, projects]);

  const handleSaveResume = async () => {
    setLoading(true);
    setSaveMessage('');
    try {
      await api.saveResume({
        title: `${personalInfo.fullName} - ATS Resume 2026`,
        template,
        personalInfo,
        careerObjective,
        education,
        skills: {
          languages: skills.languages.split(',').map(s => s.trim()).filter(Boolean),
          frameworks: skills.frameworks.split(',').map(s => s.trim()).filter(Boolean),
          tools: skills.tools.split(',').map(s => s.trim()).filter(Boolean)
        },
        experience,
        projects,
        certifications,
        achievements
      });
      setSaveMessage('Resume saved to your profile!');
      confetti({ particleCount: 50, spread: 60 });
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (e) {
      setSaveMessage('Error saving resume.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      
      {/* Top Header & Template Switcher Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-indigo-400" />
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white">ATS-Ready Resume Builder</h1>
            <p className="text-xs text-slate-400">Optimized for automated recruitment scanners & campus placement drives</p>
          </div>
        </div>

        {/* Template Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${template === 'modern' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Modern Tech
            </button>
            <button
              onClick={() => setTemplate('classic')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${template === 'classic' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Classic Minimal
            </button>
            <button
              onClick={() => setTemplate('executive')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${template === 'executive' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              Executive Slate
            </button>
          </div>

          {setActivePage && (
            <button
              onClick={() => setActivePage('resume-preview')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition flex items-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Page Preview</span>
            </button>
          )}

          <button
            onClick={handleSaveResume}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? 'Saving...' : 'Save Resume'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-2 no-print">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Split Screen: Left (Editing Form + ATS Scanner) & Right (Live Paper Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form (6 cols) */}
        <div className="lg:col-span-6 space-y-6 no-print">
          
          {/* AI ATS Scanner Widget */}
          <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
                  Real-Time AI ATS Scanner
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Score: {atsScore}/100
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  atsScore >= 80 ? 'bg-emerald-400' : atsScore >= 65 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${atsScore}%` }}
              ></div>
            </div>

            {/* Strengths & Suggestions */}
            <div className="space-y-1 text-[11px]">
              {atsFeedback.slice(0, 2).map((f, i) => (
                <p key={i} className="text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{f}</span>
                </p>
              ))}
              {atsSuggestions.slice(0, 2).map((s, i) => (
                <p key={i} className="text-amber-400 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{s}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Form Sections Accordion / Cards */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 text-xs">
            
            {/* 1. Personal Information */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1.5">
                Personal & Contact Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                  placeholder="Full Name"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  placeholder="Professional Email"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
                <input
                  type="text"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  placeholder="Phone Number"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                  placeholder="City, Country"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
                <input
                  type="text"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                  placeholder="LinkedIn (e.g. linkedin.com/in/...)"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
                <input
                  type="text"
                  value={personalInfo.github}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                  placeholder="GitHub (e.g. github.com/...)"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
            </div>

            {/* 2. Career Objective */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1.5">
                Career Objective / Professional Summary
              </h4>
              <textarea
                value={careerObjective}
                onChange={(e) => setCareerObjective(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium leading-relaxed resize-none"
              ></textarea>
            </div>

            {/* 3. Technical Skills */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400 border-b border-slate-800 pb-1.5">
                Technical Skills (Comma separated)
              </h4>
              <div>
                <label className="block text-slate-400 mb-1">Programming Languages</label>
                <input
                  type="text"
                  value={skills.languages}
                  onChange={(e) => setSkills({ ...skills, languages: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Frameworks & Libraries</label>
                <input
                  type="text"
                  value={skills.frameworks}
                  onChange={(e) => setSkills({ ...skills, frameworks: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Databases & Developer Tools</label>
                <input
                  type="text"
                  value={skills.tools}
                  onChange={(e) => setSkills({ ...skills, tools: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>
            </div>

            {/* 4. Education */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1.5">
                Education
              </h4>
              {education.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].degree = e.target.value;
                      setEducation(updated);
                    }}
                    placeholder="Degree & Major"
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].institution = e.target.value;
                        setEducation(updated);
                      }}
                      placeholder="University / Institute"
                      className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      value={edu.score}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].score = e.target.value;
                        setEducation(updated);
                      }}
                      placeholder="CGPA / Score"
                      className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Key Projects */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5">
                Technical Projects
              </h4>
              {projects.map((proj, pIdx) => (
                <div key={pIdx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[pIdx].title = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="Project Title"
                      className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                    <input
                      type="text"
                      value={proj.techStack}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[pIdx].techStack = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="Tech Stack"
                      className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  {proj.bullets.map((b, bIdx) => (
                    <input
                      key={bIdx}
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[pIdx].bullets[bIdx] = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="Metric bullet point (e.g. Developed API reducing latency by 30%)"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]"
                    />
                  ))}
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Preview Paper (6 cols) */}
        <div className="lg:col-span-6 flex justify-center">
          <div 
            id="printable-resume"
            className="resume-paper w-full max-w-[650px] bg-white text-slate-900 shadow-2xl rounded-2xl p-8 sm:p-10 font-sans text-xs space-y-4 border border-slate-200"
          >
            {/* Header */}
            <div className={`pb-3 ${template === 'modern' ? 'border-b-2 border-indigo-600' : 'border-b border-slate-400 text-center'}`}>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">
                {personalInfo.fullName || 'YOUR NAME'}
              </h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-1.5 font-medium">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>&bull; {personalInfo.phone}</span>}
                {personalInfo.location && <span>&bull; {personalInfo.location}</span>}
                {personalInfo.linkedin && <span>&bull; {personalInfo.linkedin}</span>}
                {personalInfo.github && <span>&bull; {personalInfo.github}</span>}
              </div>
            </div>

            {/* Objective */}
            {careerObjective && (
              <div>
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Professional Objective
                </h3>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {careerObjective}
                </p>
              </div>
            )}

            {/* Technical Skills */}
            <div>
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                Technical Skills
              </h3>
              <div className="space-y-0.5 text-[11px] text-slate-700">
                <p><strong>Languages:</strong> {skills.languages}</p>
                <p><strong>Frameworks & Web:</strong> {skills.frameworks}</p>
                <p><strong>Tools & Databases:</strong> {skills.tools}</p>
              </div>
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Education
                </h3>
                {education.map((edu, idx) => (
                  <div key={idx} className="flex items-start justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-slate-900">{edu.degree}</p>
                      <p className="text-slate-700">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{edu.year}</p>
                      <p className="font-bold text-indigo-700">{edu.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Experience & Internships
                </h3>
                {experience.map((exp, idx) => (
                  <div key={idx} className="mb-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{exp.role} &ndash; <span className="font-medium text-slate-700">{exp.company}</span></p>
                      <p className="font-medium text-slate-600">{exp.duration}</p>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 mt-1 text-[10.5px]">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Academic & Technical Projects
                </h3>
                {projects.map((proj, idx) => (
                  <div key={idx} className="mb-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{proj.title} <span className="text-[10px] font-normal text-slate-500">| {proj.techStack}</span></p>
                      {proj.liveUrl && <span className="text-[10px] text-indigo-600 font-semibold">{proj.liveUrl.replace('https://', '')}</span>}
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 mt-1 text-[10.5px]">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications & Achievements */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              {certifications.length > 0 && (
                <div>
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] mb-1">
                    Certifications
                  </h3>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-700">
                    {certifications.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              {achievements.length > 0 && (
                <div>
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] mb-1">
                    Achievements
                  </h3>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-700">
                    {achievements.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
