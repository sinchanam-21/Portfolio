import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  ArrowUp, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Lock, 
  Unlock, 
  Sliders, 
  Sparkles,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, isOwner, lockOwner, setIsAuthModalOpen, setIsEditModalOpen } = usePortfolio();
  const { profile } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222] pt-16 pb-12 text-[#888] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1E1E1E]">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#161616] border border-[#C5A059]/40 flex items-center justify-center font-serif text-[#C5A059] text-sm font-bold">
                S
              </div>
              <span className="font-serif text-base text-[#F2F2F2] tracking-wide">
                {profile.name}
              </span>
            </div>
            
            <p className="text-[#888] max-w-sm leading-relaxed text-xs">
              Computer Science Engineer from Maharaja Institute of Technology Mysore, focusing on dependable AI pipelines, machine learning models, and production software architectures.
            </p>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono bg-[#141414] border border-[#262626] text-[#BBB] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                Engineering Showcase // AI & Software Systems
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] uppercase tracking-widest text-[#F2F2F2] font-serif font-bold">Index</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-[#C5A059] transition">01. Overview</a></li>
              <li><a href="#about" className="hover:text-[#C5A059] transition">02. Education & Background</a></li>
              <li><a href="#skills" className="hover:text-[#C5A059] transition">03. Technical Capabilities</a></li>
              <li><a href="#projects" className="hover:text-[#C5A059] transition">04. Engineering Projects</a></li>
              <li><a href="#certifications" className="hover:text-[#C5A059] transition">05. Credentials & Badges</a></li>
              <li><a href="#contact" className="hover:text-[#C5A059] transition">06. Inquiry & Dispatch</a></li>
            </ul>
          </div>

          {/* Connect & Owner Controls */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest text-[#F2F2F2] font-serif font-bold">Registry & Access</h4>
            
            <div className="flex items-center gap-2.5">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#141414] border border-[#262626] flex items-center justify-center text-[#BBB] hover:text-[#C5A059] hover:border-[#C5A059] transition"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#141414] border border-[#262626] flex items-center justify-center text-[#BBB] hover:text-[#C5A059] hover:border-[#C5A059] transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="w-8 h-8 rounded bg-[#141414] border border-[#262626] flex items-center justify-center text-[#BBB] hover:text-[#C5A059] hover:border-[#C5A059] transition"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="w-8 h-8 rounded bg-[#141414] border border-[#262626] flex items-center justify-center text-[#BBB] hover:text-[#C5A059] hover:border-[#C5A059] transition"
                aria-label="Phone"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Owner Privilege Box */}
            <div className="bg-[#111111] border border-[#262626] rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="text-[#C5A059] font-medium text-[11px] uppercase tracking-wider">Owner: Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#666]" />
                      <span className="text-[#666] font-medium text-[11px] uppercase tracking-wider">Owner: Protected</span>
                    </>
                  )}
                </div>

                {isOwner ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-2 py-1 rounded bg-[#1A1A1A] border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={lockOwner}
                      className="px-2 py-1 rounded bg-[#1A1A1A] text-[#888] hover:text-white text-[10px] cursor-pointer"
                    >
                      Lock
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-2.5 py-1 rounded border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black text-[10px] font-medium uppercase tracking-wider transition cursor-pointer"
                  >
                    Authenticate
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-center sm:text-left text-xs">
            © {new Date().getFullYear()} Sinchana M. Professional Engineering Portfolio.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#888] hover:text-[#C5A059] transition cursor-pointer px-3 py-1.5 rounded hover:bg-[#141414]"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
