import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  ArrowRight, 
  Download, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Code2, 
  Edit3, 
  CheckCircle2, 
  Award,
  FileText
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, isOwner, setIsEditModalOpen, setEditModalTab, setIsResumeModalOpen } = usePortfolio();
  const { profile } = data;

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#0A0A0A]">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-8 left-1/4 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl" />
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-[#8E6E3A]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            
            {/* Status Badge & Tracker */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>
                <span className="text-[10px] uppercase tracking-widest text-[#999]">{profile.status}</span>
              </div>

              {isOwner && (
                <button
                  onClick={() => {
                    setEditModalTab('profile');
                    setIsEditModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-semibold border border-[#C5A059]/60 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Bio
                </button>
              )}
            </div>

            {/* Subtitle tracker */}
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#666] mb-3">
              Executive Profile & Engineering Focus
            </h2>

            {/* Greeting & Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-[#F2F2F2] leading-[1.1] mb-4">
              Hi, I'm <span className="bg-gradient-to-tr from-[#C5A059] via-[#E4C586] to-[#8E6E3A] bg-clip-text text-transparent">{profile.name}</span>
            </h1>

            {/* Role title */}
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#BBB] mb-6 flex items-center gap-2.5">
              <Code2 className="w-5 h-5 text-[#C5A059] inline shrink-0" />
              <span>{profile.role}</span>
            </p>

            {/* Executive Summary in serif quote */}
            <div className="mb-8 pl-4 border-l-2 border-[#C5A059]/70 bg-[#0F0F0F]/60 py-3 pr-4 rounded-r-lg">
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[#BBB] italic">
                "{profile.summary}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <a
                id="hero-explore-projects-btn"
                href="#projects"
                className="px-6 py-3 rounded text-sm font-medium border border-[#C5A059] bg-[#C5A059] text-black hover:bg-[#A88243] hover:border-[#A88243] transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-black/50"
              >
                <span>Featured Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                id="hero-view-resume-btn"
                onClick={() => setIsResumeModalOpen(true)}
                className="px-5 py-3 rounded text-sm font-medium bg-[#1A1A1A] border border-[#333] text-[#EEE] hover:border-[#C5A059] hover:text-[#C5A059] transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>Executive CV</span>
              </button>

              <a
                id="hero-contact-btn"
                href="#contact"
                className="px-5 py-3 rounded text-sm font-medium text-[#999] hover:text-[#F2F2F2] hover:bg-[#161616] border border-transparent hover:border-[#222] transition flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#666]" />
                <span>Contact Direct</span>
              </a>
            </div>

            {/* Contact Quick Pills */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#999] pt-4 border-t border-[#222] w-full">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{profile.location}</span>
              </div>
              <a 
                href={`mailto:${profile.email}`} 
                className="flex items-center gap-1.5 text-[#C5A059] hover:underline transition"
              >
                <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{profile.email}</span>
              </a>
              <a 
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} 
                className="flex items-center gap-1.5 hover:text-[#EEE] transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#666] shrink-0" />
                <span>{profile.phone}</span>
              </a>
            </div>

          </div>

          {/* Right Card / Registry Milestone Highlights */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Identity Profile Badge Card */}
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-6 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#222]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#8E6E3A] flex items-center justify-center text-[#0A0A0A] font-serif font-bold text-xl shrink-0">
                  SM
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#F2F2F2] text-lg">{profile.name}</h3>
                  <p className="text-xs text-[#999] font-sans">MIT Mysore (2023–2027)</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-medium">CSE Scholar</span>
                  </div>
                </div>
              </div>

              {/* Social connect links */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#C5A059] text-xs text-[#BBB] hover:text-[#F2F2F2] transition"
                >
                  <Github className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>GitHub</span>
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#C5A059] text-xs text-[#BBB] hover:text-[#F2F2F2] transition"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Competency highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#666] uppercase tracking-wider text-[10px]">Academic Degree</span>
                  <span className="font-serif text-[#EEE]">BE - CSE (CGPA: 7.5)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#666] uppercase tracking-wider text-[10px]">Specialization</span>
                  <span className="text-[#C5A059]">Machine Learning & GenAI</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#666] uppercase tracking-wider text-[10px]">Achievements</span>
                  <span className="text-[#BBB]">State-Level Volleyball Player</span>
                </div>
              </div>
            </div>

            {/* Proprietary Milestone Counters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0D0D0D] border border-[#222] rounded-lg p-4 flex flex-col">
                <span className="text-2xl font-serif text-[#C5A059]">3+</span>
                <span className="text-[10px] uppercase tracking-widest text-[#666] font-medium mt-1">Core Tech Projects</span>
              </div>
              <div className="bg-[#0D0D0D] border border-[#222] rounded-lg p-4 flex flex-col">
                <span className="text-2xl font-serif text-[#F2F2F2]">3</span>
                <span className="text-[10px] uppercase tracking-widest text-[#666] font-medium mt-1">Certifications</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
