import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Printer, CheckCircle2, FileText, Sparkles, 
  ExternalLink, Mail, Phone, MapPin, Globe, Linkedin, Github, Award
} from 'lucide-react';
import { api } from '../services/api';

export default function ResumePreviewPage({ setActivePage, resumeId }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState('modern'); // 'modern' | 'classic' | 'minimal'

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await api.getResumes();
        if (res.resumes && res.resumes.length > 0) {
          const selected = resumeId ? res.resumes.find(r => r.id === resumeId) : res.resumes[0];
          setResume(selected || res.resumes[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !resume) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading professional resume preview...</p>
      </div>
    );
  }

  const { personal, education = [], skills = {}, experience = [], projects = [], certifications = [], achievements = [] } = resume;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      
      {/* Top Controls (Hidden during print) */}
      <div className="print:hidden glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActivePage('resume')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Resume Builder & Editor</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>ATS Resume Preview</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ATS Score: {resume.atsScore || 92}/100
            </span>
          </h1>
        </div>

        {/* Template Selector & Print Button */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg transition ${template === 'modern' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Modern
            </button>
            <button
              onClick={() => setTemplate('classic')}
              className={`px-3 py-1.5 rounded-lg transition ${template === 'classic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Classic
            </button>
            <button
              onClick={() => setTemplate('minimal')}
              className={`px-3 py-1.5 rounded-lg transition ${template === 'minimal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Minimal
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 White Page for Clean ATS Scanning) */}
      <div 
        id="resume-printable-doc"
        className={`bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 mx-auto max-w-4xl border border-slate-200 font-sans print:border-none print:shadow-none print:p-0 ${
          template === 'classic' ? 'font-serif' : 'font-sans'
        }`}
      >
        {/* Header / Personal Info */}
        <div className={`border-b pb-6 ${template === 'modern' ? 'border-indigo-600' : 'border-slate-300'}`}>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase">
            {personal?.fullName || 'Candidate Name'}
          </h1>
          <p className="text-sm font-bold text-indigo-700 tracking-wide mt-0.5">
            {personal?.title || 'Aspiring Software Development Engineer'}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-3">
            {personal?.email && (
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{personal.email}</span>
              </span>
            )}
            {personal?.phone && (
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{personal.phone}</span>
              </span>
            )}
            {personal?.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{personal.location}</span>
              </span>
            )}
            {personal?.linkedin && (
              <span className="flex items-center space-x-1">
                <Linkedin className="w-3.5 h-3.5 text-slate-500" />
                <span>{personal.linkedin}</span>
              </span>
            )}
            {personal?.github && (
              <span className="flex items-center space-x-1">
                <Github className="w-3.5 h-3.5 text-slate-500" />
                <span>{personal.github}</span>
              </span>
            )}
          </div>

          {personal?.summary && (
            <p className="text-xs text-slate-700 mt-4 leading-relaxed">
              {personal.summary}
            </p>
          )}
        </div>

        {/* Technical Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <div className="py-4 border-b border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              Technical Proficiencies
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              {skills.languages && (
                <p><span className="font-bold">Languages:</span> {Array.isArray(skills.languages) ? skills.languages.join(', ') : skills.languages}</p>
              )}
              {skills.frameworks && (
                <p><span className="font-bold">Frameworks & Libraries:</span> {Array.isArray(skills.frameworks) ? skills.frameworks.join(', ') : skills.frameworks}</p>
              )}
              {skills.tools && (
                <p><span className="font-bold">Tools & Cloud:</span> {Array.isArray(skills.tools) ? skills.tools.join(', ') : skills.tools}</p>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="py-4 border-b border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
              Work & Internship Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                    <span className="text-slate-500 font-normal">{exp.duration}</span>
                  </div>
                  {exp.bullets && (
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="py-4 border-b border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
              Key Engineering Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.title} <span className="text-indigo-600 font-normal">| {proj.techStack}</span></span>
                    <span className="text-slate-500 font-normal">{proj.link || ''}</span>
                  </div>
                  {proj.bullets && (
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {proj.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="py-4 border-b border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs flex justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{edu.degree} — {edu.institution}</p>
                    <p className="text-slate-600">{edu.specialization || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-700">{edu.year}</p>
                    <p className="text-indigo-700 font-bold">{edu.grade ? `CGPA: ${edu.grade}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {(certifications.length > 0 || achievements.length > 0) && (
          <div className="pt-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              Honors & Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0"></span>
                  <span>{c}</span>
                </div>
              ))}
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
