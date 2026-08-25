import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { 
  FileText, 
  ExternalLink, 
  Download, 
  GraduationCap, 
  Award, 
  Mail, 
  MapPin, 
  FolderGit2, 
  Briefcase, 
  CheckCircle2,
  Code2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../UI/Icons';

export const ResumeOutput: React.FC = () => {
  const resumeUrl = portfolioConfig.resumeUrl || '/resume.pdf';

  return (
    <div className="my-3 space-y-4 font-mono text-xs md:text-sm select-text w-full">
      {/* Top Controls Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-black/60 border border-emerald-500/40 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-sm md:text-base">
              {portfolioConfig.name} — Full Curriculum Vitae
            </div>
            <div className="text-gray-400 text-xs">
              Complete Interactive Resume • Formatted for Terminal
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded transition shadow hover:scale-105 active:scale-95 cursor-pointer text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open PDF ↗</span>
          </a>

          <a
            href={resumeUrl}
            download={`${portfolioConfig.name.replace(/\s+/g, '_')}_Resume.pdf`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-emerald-500 text-white font-semibold rounded transition hover:scale-105 active:scale-95 cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Main Resume Paper Container */}
      <div className="p-4 md:p-6 bg-black/50 border border-emerald-500/30 rounded-xl space-y-6 shadow-2xl">
        
        {/* Header Section */}
        <div className="border-b border-emerald-500/30 pb-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {portfolioConfig.name.toUpperCase()}
              </h1>
              <p className="text-xs md:text-sm text-emerald-400 font-semibold mt-0.5 leading-relaxed">
                Aspiring AI/ML Engineer | Python • Machine Learning • Data Structures & Algorithms
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-3 py-1 bg-emerald-950/90 border border-emerald-600/70 text-emerald-300 rounded font-mono text-xs font-semibold whitespace-nowrap shadow-sm">
                B.Tech CSE (AI & ML)
              </span>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{portfolioConfig.location}</span>
            </span>
            <a href={`mailto:${portfolioConfig.email}`} className="flex items-center gap-1 text-emerald-300 hover:underline">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>{portfolioConfig.email}</span>
            </a>
            <a href="https://www.linkedin.com/in/aryan-prasad06/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sky-400 hover:underline">
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>linkedin.com/in/aryan-prasad06</span>
            </a>
            <a href="https://github.com/aryan-111106" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-400 hover:underline">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>github.com/aryan-111106</span>
            </a>
          </div>
        </div>

        {/* 1. Professional Summary */}
        <div className="space-y-2">
          <h2 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/20 pb-1">
            <span>01.</span>
            <span>Professional Summary</span>
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Second-year Computer Science student specializing in Artificial Intelligence & Machine Learning at Haldia Institute of Technology. Strong foundation in Machine Learning, Data Structures & Algorithms, and Python programming, with practical experience building computer vision pipelines, generative AI assistants, and automated systems. Passionate about applying problem-solving skills to real-world software engineering challenges.
          </p>
        </div>

        {/* 2. Technical Skills */}
        <div className="space-y-2.5">
          <h2 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/20 pb-1">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>02. Technical Skills & Competencies</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-black/40 border border-slate-800 rounded">
              <span className="text-emerald-300 font-bold block mb-1">Programming Languages:</span>
              <div className="text-gray-300 flex flex-wrap gap-1.5">
                {["Python (Advanced)", "C", "JavaScript", "TypeScript", "SQL", "HTML5/CSS3"].map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-gray-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-black/40 border border-slate-800 rounded">
              <span className="text-emerald-300 font-bold block mb-1">AI & Machine Learning:</span>
              <div className="text-gray-300 flex flex-wrap gap-1.5">
                {["Machine Learning", "OpenCV", "Gemini API", "AI Agents", "LLM Integration", "Pandas", "NumPy", "Scikit-Learn"].map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-purple-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-black/40 border border-slate-800 rounded">
              <span className="text-emerald-300 font-bold block mb-1">Developer Tools & Platforms:</span>
              <div className="text-gray-300 flex flex-wrap gap-1.5">
                {["Git", "GitHub", "VS Code", "Linux / Bash", "Jupyter Notebook", "Oracle Cloud (OCI)", "Vite"].map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-sky-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-black/40 border border-slate-800 rounded">
              <span className="text-emerald-300 font-bold block mb-1">Core Fundamentals:</span>
              <div className="text-gray-300 flex flex-wrap gap-1.5">
                {["Data Structures & Algorithms (DSA)", "Object-Oriented Programming (OOP)", "Computer Vision", "Model Evaluation"].map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-amber-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Featured Software Projects */}
        <div className="space-y-3">
          <h2 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/20 pb-1">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>03. Featured Software Engineering Projects</span>
          </h2>

          <div className="space-y-3">
            {portfolioConfig.projects.slice(0, 5).map((proj) => (
              <div key={proj.id} className="p-3 bg-black/40 border border-slate-800 hover:border-emerald-500/50 rounded-lg transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs md:text-sm">{proj.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700/60">
                      {proj.category}
                    </span>
                  </div>
                  {proj.githubUrl && (
                    <a 
                      href={proj.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>github.com/aryan-111106/{proj.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-2">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {proj.tags.map((t, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Education History */}
        <div className="space-y-3">
          <h2 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/20 pb-1">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>04. Education</span>
          </h2>

          <div className="space-y-3">
            {portfolioConfig.education.map((edu, idx) => (
              <div key={idx} className="p-3 bg-black/40 border border-slate-800 rounded-lg space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <span className="font-bold text-white text-xs md:text-sm">{edu.institution}</span>
                  <span className="text-emerald-400 font-mono">{edu.period}</span>
                </div>
                <div className="text-xs text-emerald-300 font-semibold">{edu.degree}</div>
                <div className="text-xs text-gray-400">{edu.location}</div>
                {edu.details && (
                  <ul className="mt-1 space-y-0.5 text-xs text-gray-300 list-disc list-inside">
                    {edu.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Professional Certifications & Honors */}
        <div className="space-y-3">
          <h2 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/20 pb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>05. Certifications & Honors</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {portfolioConfig.certifications?.map((cert, idx) => (
              <div key={idx} className="p-2.5 bg-black/40 border border-slate-800 rounded flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-200">{cert.title}</div>
                  <div className="text-[11px] text-gray-400">Issuer: {cert.issuer} • {cert.year}</div>
                </div>
              </div>
            ))}

            {portfolioConfig.awards?.map((award, idx) => (
              <div key={idx} className="p-2.5 bg-black/40 border border-amber-500/30 rounded flex items-start gap-2">
                <Award className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-yellow-300">{award.title}</div>
                  <div className="text-[11px] text-gray-400">{award.issuer} • {award.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Experience & Simulations */}
        <div className="space-y-3">
          <h2 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/20 pb-1">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>06. Practical Engineering & Project Experience</span>
          </h2>

          <div className="space-y-2.5">
            {portfolioConfig.experience.map((exp, idx) => (
              <div key={idx} className="p-3 bg-black/40 border border-slate-800 rounded-lg space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <span className="font-bold text-white">{exp.role} — <span className="text-emerald-300">{exp.company}</span></span>
                  <span className="text-gray-400 font-mono">{exp.period}</span>
                </div>
                <div className="text-[11px] text-gray-400">{exp.location}</div>
                <ul className="mt-1 space-y-0.5 text-xs text-gray-300 list-disc list-inside">
                  {exp.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Languages */}
        <div className="space-y-2">
          <h2 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/20 pb-1">
            <span>07.</span>
            <span>Spoken Languages</span>
          </h2>
          <div className="flex flex-wrap gap-2 text-xs text-gray-300">
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded">English (Professional Working)</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded">Hindi (Native / Bilingual)</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded">Bengali (Fluent Working)</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded">Sanskrit & German (Elementary)</span>
          </div>
        </div>

        {/* Bottom Download & Contact Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified Candidate Profile • Open to Internships & Collaboration</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF ↗</span>
            </a>
            <a
              href={resumeUrl}
              download={`${portfolioConfig.name.replace(/\s+/g, '_')}_Resume.pdf`}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
