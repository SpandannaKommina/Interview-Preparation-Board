import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, Video, Code, FileText, 
  Building2, Brain, Trophy, Shield, ChevronDown, ChevronUp, Star, Users, Briefcase, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ setActivePage }) {
  const { loginWithGoogle, login } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleDemoStudentLogin = async () => {
    try {
      await login({ email: 'student@interviewprep.com', password: 'Student@123', rememberMe: true });
      setActivePage('dashboard');
    } catch (e) {
      console.error(e);
      setActivePage('login');
    }
  };

  const handleDemoAdminLogin = async () => {
    try {
      await login({ email: 'admin@interviewprep.com', password: 'Admin@123', rememberMe: true });
      setActivePage('admin');
    } catch (e) {
      console.error(e);
      setActivePage('login');
    }
  };

  const features = [
    {
      icon: Video,
      title: 'AI Mock Interview Room',
      desc: 'Conduct realistic technical & HR voice/text interviews with instant AI scoring, STAR feedback, and model answers.',
      badge: 'AI Powered',
      color: 'from-blue-500 to-indigo-600',
      action: () => setActivePage('interview')
    },
    {
      icon: Code,
      title: 'LeetCode-Style Coding IDE',
      desc: 'Solve top placement DSA problems in Python, C++, Java, and C with instant test cases evaluation and memory profiling.',
      badge: 'Interactive',
      color: 'from-purple-500 to-pink-600',
      action: () => setActivePage('coding')
    },
    {
      icon: FileText,
      title: 'ATS Resume Builder & Scanner',
      desc: 'Create recruiter-ready tech resumes with ATS score checker, bullet point action-verb suggestions, and 1-click PDF download.',
      badge: 'ATS 95%+',
      color: 'from-cyan-500 to-blue-600',
      action: () => setActivePage('resume')
    },
    {
      icon: Building2,
      title: 'Company-Specific Prep Hub',
      desc: 'Crack TCS, Infosys, Amazon, Google, Microsoft, and Accenture with syllabus, salary packages, and real interview tests.',
      badge: 'Top 10 Giants',
      color: 'from-emerald-500 to-teal-600',
      action: () => setActivePage('companies')
    },
    {
      icon: Brain,
      title: 'Aptitude & Reasoning Simulator',
      desc: 'Master Quantitative, Logical, and Verbal tests with timed exam mode, negative marking, and detailed formulas.',
      badge: 'Exam Mode',
      color: 'from-amber-500 to-orange-600',
      action: () => setActivePage('aptitude')
    },
    {
      icon: Trophy,
      title: 'Gamified Leaderboard & Badges',
      desc: 'Earn XP for every solved problem and completed roadmap milestone, unlock achievement badges, and climb campus rankings.',
      badge: 'Gamification',
      color: 'from-rose-500 to-purple-600',
      action: () => setActivePage('leaderboard')
    }
  ];

  const faqs = [
    {
      q: 'How does the AI Mock Interview evaluate my answers?',
      a: 'The AI evaluates your response across 4 core pillars: Technical Accuracy, Communication Clarity, Problem-Solving Depth, and Completeness. For behavioral questions, it evaluates your adherence to the STAR framework (Situation, Task, Action, Result) and highlights strengths and actionable areas for improvement.'
    },
    {
      q: 'Can I practice coding in multiple programming languages?',
      a: 'Yes! The Coding Practice module features starter templates, syntax highlighting, and test case execution for Python, C++, Java, and C.'
    },
    {
      q: 'Does the Resume Builder produce truly ATS-friendly output?',
      a: 'Absolutely. The templates adhere to clean ATS-parseable single-column layouts, standard headers, and include our AI ATS scanner that tests keyword density and action-verb strength before you download your PDF.'
    },
    {
      q: 'Is this platform suitable for both campus placement and experienced SDE roles?',
      a: 'Yes. The curriculum ranges from campus Aptitude, C/C++ fundamentals, and IT Service company rounds (TCS, Infosys, Accenture) to advanced Product company DSA, System Design, and Bar Raiser rounds (Google, Amazon, Microsoft).'
    }
  ];

  return (
    <div className="w-full min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-blue/20 via-brand-purple/20 to-brand-electric/20 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Announcement pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-brand-purple/40 text-xs font-semibold text-slate-200 mb-8 shadow-lg shadow-purple-900/20">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="gradient-text-electric">2026 Campus Placement & SDE Season Ready</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Master Your Next <br />
            <span className="gradient-text-electric">Technical & HR Interview</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The complete all-in-one preparation suite for job seekers and college students. 
            AI Mock Interviews, LeetCode-style Coding IDE, ATS Resume Builder, and Top 10 Company Prep.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActivePage('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Start Preparing Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDemoStudentLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-panel border border-slate-700/80 hover:bg-slate-800/80 transition flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>One-Click Student Demo</span>
            </button>
            <button
              onClick={handleDemoAdminLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-amber-300 glass-panel border border-amber-800/50 hover:bg-amber-950/40 transition flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>One-Click Admin Demo</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-white">94%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Placement Offer Rate</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-cyan-400">500+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Curated Placement Problems</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-purple-400">10 Top</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Tech & IT Hiring Giants</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-emerald-400">24/7 AI</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Speech & Text Mock Evaluator</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Features Showcase */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-purple">Built for Excellence</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything You Need To Secure Your Dream Offer
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Eliminate guesswork. Follow a comprehensive structured pathway designed by industry hiring managers and placement toppers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  onClick={feat.action}
                  className="glass-card p-6 rounded-2xl cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-tr ${feat.color} text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-cyan-400 transition">
                    <span>Explore Module</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Step-by-Step Blueprint</h2>
            <p className="text-3xl font-extrabold text-white mt-2">How Students Crack Placements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-sm">
                01
              </div>
              <h4 className="font-bold text-white text-base">Placement Roadmap</h4>
              <p className="text-xs text-slate-400 mt-2">
                Learn core CS, OOPs, DBMS, OS, Networks, and programming fundamentals systematically.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-sm">
                02
              </div>
              <h4 className="font-bold text-white text-base">Hands-on Coding</h4>
              <p className="text-xs text-slate-400 mt-2">
                Solve frequent DSA patterns with our built-in LeetCode-style code runner and test suites.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-sm">
                03
              </div>
              <h4 className="font-bold text-white text-base">AI Mock Interviews</h4>
              <p className="text-xs text-slate-400 mt-2">
                Practice answering technical and HR questions under timed pressure with actionable AI feedback.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-sm">
                04
              </div>
              <h4 className="font-bold text-white text-base">Job Offer Ready</h4>
              <p className="text-xs text-slate-400 mt-2">
                Generate ATS-optimized resumes and pass company-specific mock tests for TCS, Infosys, Amazon, etc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Success Stories</h2>
            <p className="text-3xl font-extrabold text-white mt-2">Placed at Top Tier-1 & Tier-2 Firms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center space-x-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The AI Mock Interview module was a game changer for my Amazon SDE-1 loop. The Bar Raiser behavioral feedback helped me structure every STAR scenario perfectly."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-white">Rohit Sen</p>
                  <p className="text-[11px] text-emerald-400 font-medium">Placed at Amazon (SDE-1)</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center space-x-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "I cracked TCS Digital with a 7.5 LPA package on my very first attempt. The TCS-specific practice questions and aptitude tests accurately mirrored the real NQT exam."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Student" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-white">Ananya Sharma</p>
                  <p className="text-[11px] text-cyan-400 font-medium">Placed at TCS Digital</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center space-x-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The ATS Resume builder flagged that my project descriptions lacked quantifiable outcomes. After boosting my score to 92%, my callback rate tripled!"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Student" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-white">Karthik Reddy</p>
                  <p className="text-[11px] text-purple-400 font-medium">Placed at Infosys SP (9.5 LPA)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Simple & Accessible</h2>
            <p className="text-3xl font-extrabold text-white mt-2">Choose Your Preparation Plan</p>
            <p className="text-xs text-slate-400 mt-2">Zero financial barriers for students preparing for campus placements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider">
                  Community Free
                </span>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Essential placement preparation toolkit for all college students.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Full Core CS Roadmap (C, C++, Java, Python, DSA)</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>In-Browser Coding Practice & Test Runner</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Aptitude & Reasoning Practice Tests</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>3 AI Mock Interviews / month</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>1 ATS Resume Template with PDF Export</span></li>
                </ul>
              </div>

              <button
                onClick={() => setActivePage('register')}
                className="mt-8 w-full py-3 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Campus Tier */}
            <div className="glass-panel p-8 rounded-3xl border border-indigo-500/60 relative flex flex-col justify-between shadow-2xl shadow-indigo-900/30">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider">
                Recommended
              </div>

              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                  Campus Pro Career
                </span>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-white">$9</span>
                  <span className="text-xs text-slate-400">/ month (or Free via College)</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Comprehensive suite for students targeting Tier-1 Product Companies.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Unlimited AI Mock Interviews with Voice Recognition</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Deep AI Code Optimization & Big-O Feedback</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>All 10 Company Prep Modules & Exam Patterns</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Full ATS Resume Review with Keyword Density Scanner</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Personal Study Planner with Push Notifications</span></li>
                </ul>
              </div>

              <button
                onClick={() => setActivePage('register')}
                className="mt-8 w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-purple">Questions Answered</h2>
            <p className="text-3xl font-extrabold text-white mt-2">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-indigo-400 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Banner CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-indigo-500/40 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/20 blur-[100px] pointer-events-none"></div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your Career?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mt-4 leading-relaxed">
              Join thousands of students practicing daily to land offers at Google, Microsoft, Amazon, TCS, and Infosys.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActivePage('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                Create Free Account
              </button>
              <button
                onClick={handleDemoStudentLogin}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-panel border border-slate-700 hover:bg-slate-800 transition"
              >
                Instant Student Demo Login
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
