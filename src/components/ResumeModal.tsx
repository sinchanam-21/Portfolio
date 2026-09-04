import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  Phone, 
  Github, 
  Linkedin,
  FileCheck
} from 'lucide-react';

export const ResumeModal: React.FC = () => {
  const { data, isResumeModalOpen, setIsResumeModalOpen } = usePortfolio();
  const { profile, education, skills, projects, certifications } = data;

  const [copied, setCopied] = useState(false);

  if (!isResumeModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const resumeText = `
${profile.name.toUpperCase()}
Email: ${profile.email} | Mobile: ${profile.phone}
LinkedIn: ${profile.linkedinUrl}
GitHub: ${profile.githubUrl}

PROFESSIONAL SUMMARY
${profile.summary}

EDUCATION
${education.map(e => `${e.degree} - ${e.institution} (${e.period}) [${e.score}]`).join('\n')}

TECHNICAL SKILLS
${skills.map(s => `• ${s.name}: ${s.skills.map(item => item.name).join(', ')}`).join('\n')}

PROJECTS
${projects.map(p => `• ${p.title} (${p.category}): ${p.description}\n  Tech Stack: ${p.techStack.join(', ')}`).join('\n')}

CERTIFICATIONS
${certifications.map(c => `• ${c.title}: ${c.issuer} (${c.issueDate})`).join('\n')}

ADDITIONAL INFORMATION
• Interests: ${profile.interests.join(', ')}
• Achievements: ${profile.achievements.join(' ')}
    `.trim();

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Container Card */}
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:rounded-none border border-[#333]">
        
        {/* Modal Action Header (Hidden when printing) */}
        <div className="bg-[#0F0F0F] text-[#F2F2F2] px-6 py-3.5 flex items-center justify-between border-b border-[#222] print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-4 h-4 text-[#C5A059]" />
            <span className="font-serif text-sm tracking-wide text-[#F2F2F2]">
              Official Executive Curriculum Vitae • {profile.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded text-xs font-medium bg-[#1A1A1A] hover:bg-[#222] text-[#EEE] border border-[#333] hover:border-[#C5A059] transition flex items-center gap-1.5 cursor-pointer"
              title="Copy as plain text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#C5A059]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] hover:bg-[#A88243] text-black transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => setIsResumeModalOpen(false)}
              className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1A1A1A] transition ml-2 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ATS-Formatted Clean Printable Resume Sheet */}
        <div className="overflow-y-auto p-8 sm:p-12 text-slate-900 font-sans space-y-6 print:p-0 print:overflow-visible">
          
          {/* Header Section */}
          <div className="border-b-2 border-slate-900 pb-4 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              {profile.name.toUpperCase()}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-slate-700 mt-2">
              <div className="flex items-center gap-1">
                <span className="font-bold">Email:</span>
                <a href={`mailto:${profile.email}`} className="text-blue-700 hover:underline">
                  {profile.email}
                </a>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-bold">Mobile:</span>
                <span className="text-slate-900">{profile.phone}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-bold">LinkedIn:</span>
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  {profile.linkedinUrl}
                </a>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-bold">GitHub:</span>
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  {profile.githubUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {profile.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs sm:text-sm">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree}</span>
                    <span className="text-slate-800 font-semibold">{edu.score}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 text-xs">
                    <span>{edu.institution}</span>
                    <span className="font-mono">{edu.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs sm:text-sm">
              {skills.map((cat) => (
                <div key={cat.id} className="leading-snug">
                  <span className="font-bold text-slate-900">• {cat.name}: </span>
                  <span className="text-slate-700">
                    {cat.skills.map(s => s.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
              Projects
            </h2>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs sm:text-sm">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.title}</span>
                    <span className="text-[11px] font-mono text-slate-600 font-normal">{proj.techStack.slice(0, 4).join(', ')}</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed mt-0.5">
                    {proj.description}
                  </p>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-600 mt-1 space-y-0.5">
                      {proj.highlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="space-y-1 text-xs sm:text-sm text-slate-800">
              {certifications.map((cert) => (
                <li key={cert.id}>
                  • <span className="font-semibold">{cert.title}:</span> {cert.issuer} ({cert.issueDate})
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Additional Information
            </h2>
            <div className="text-xs sm:text-sm text-slate-800 space-y-1">
              <div>
                • <span className="font-bold">Interests:</span> {profile.interests.join(', ')}
              </div>
              <div>
                • <span className="font-bold">Achievements:</span> {profile.achievements.join(' ')}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
