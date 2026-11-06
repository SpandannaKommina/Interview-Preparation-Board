import React from 'react';
import { Sparkles, Heart, Shield, Terminal, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm tracking-tight">INTERVIEW PREP BOARD</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The premier all-in-one placement acceleration platform for engineering students, coders, and job seekers worldwide.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 text-[11px] font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All Systems Operational (API v2.4 Active)</span>
            </div>
          </div>

          {/* Quick Modules */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActivePage('roadmap')} className="hover:text-white transition">Placement Roadmap</button></li>
              <li><button onClick={() => setActivePage('coding')} className="hover:text-white transition">Coding Practice IDE</button></li>
              <li><button onClick={() => setActivePage('interview')} className="hover:text-white transition">AI Mock Interview Room</button></li>
              <li><button onClick={() => setActivePage('interview-history')} className="hover:text-white transition">Mock Interview Archives</button></li>
              <li><button onClick={() => setActivePage('resume')} className="hover:text-white transition">ATS Resume Builder</button></li>
              <li><button onClick={() => setActivePage('resume-preview')} className="hover:text-white transition">Resume Live Preview</button></li>
              <li><button onClick={() => setActivePage('aptitude')} className="hover:text-white transition">Aptitude & Reasoning Tests</button></li>
              <li><button onClick={() => setActivePage('calendar')} className="hover:text-white transition">Interview & Study Calendar</button></li>
            </ul>
          </div>

          {/* Company Hubs */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Company Prep</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActivePage('companies')} className="hover:text-white transition">TCS Ninja, Digital & Prime</button></li>
              <li><button onClick={() => setActivePage('companies')} className="hover:text-white transition">Infosys Specialist Programmer</button></li>
              <li><button onClick={() => setActivePage('companies')} className="hover:text-white transition">Amazon SDE-1 & Bar Raiser</button></li>
              <li><button onClick={() => setActivePage('companies')} className="hover:text-white transition">Google SWE & Algorithms</button></li>
              <li><button onClick={() => setActivePage('companies')} className="hover:text-white transition">Accenture & Capgemini Prep</button></li>
            </ul>
          </div>

          {/* Connect & Legal */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Community & Resources</h4>
            <p className="text-slate-400 mb-3">
              Join thousands of placement candidates acing technical, coding, and HR rounds.
            </p>
            <div className="flex items-center space-x-3 text-slate-300">
              <span className="p-2 rounded-lg bg-slate-800/80 hover:text-white transition cursor-pointer"><Github className="w-4 h-4" /></span>
              <span className="p-2 rounded-lg bg-slate-800/80 hover:text-white transition cursor-pointer"><Linkedin className="w-4 h-4" /></span>
              <span className="p-2 rounded-lg bg-slate-800/80 hover:text-white transition cursor-pointer"><Twitter className="w-4 h-4" /></span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 space-y-3 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Interview Preparation Board. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
