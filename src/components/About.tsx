import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  GraduationCap, 
  Award, 
  Heart, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Edit3, 
  BookOpen, 
  Trophy,
  CheckCircle2
} from 'lucide-react';

export const About: React.FC = () => {
  const { data, isOwner, setIsEditModalOpen, setEditModalTab } = usePortfolio();
  const { profile, education } = data;

  return (
    <section id="about" className="py-20 bg-[#0D0D0D] border-t border-b border-[#222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-mono block mb-2">
              01 // Background & Foundations
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F2F2F2] tracking-tight">
              Academic & Executive Journey
            </h2>
          </div>
          
          {isOwner && (
            <button
              onClick={() => {
                setEditModalTab('education');
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition self-start md:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Manage Education & Bio
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Summary & Achievements */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Professional Summary Card */}
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-6 sm:p-7 shadow-lg">
              <h3 className="text-sm uppercase tracking-[0.2em] font-sans font-semibold text-[#C5A059] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Executive Summary</span>
              </h3>
              <p className="font-serif text-base text-[#BBB] italic leading-relaxed mb-4">
                "{profile.summary}"
              </p>
              <p className="text-[#999] text-xs leading-relaxed">
                Currently pursuing a Bachelor of Engineering in Computer Science at Maharaja Institute of Technology Mysore. Dedicated to bridging theoretical Machine Learning architectures with dependable production software and database engineering.
              </p>
            </div>

            {/* Achievements & Recognition */}
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-6 sm:p-7 shadow-lg">
              <h3 className="text-sm uppercase tracking-[0.2em] font-sans font-semibold text-[#F2F2F2] mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#C5A059]" />
                <span>Key Milestones & Honors</span>
              </h3>
              <ul className="space-y-3">
                {profile.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-[#BBB] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interests & Creative Pursuits */}
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-6 sm:p-7 shadow-lg">
              <h3 className="text-sm uppercase tracking-[0.2em] font-sans font-semibold text-[#999] mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8E6E3A]" />
                <span>Interests & Creative Disciplines</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-[#D1D1D1]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Education Timeline */}
          <div className="lg:col-span-6" id="education">
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-6 sm:p-7 shadow-lg h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                  <h3 className="text-base font-serif text-[#F2F2F2] flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                    <span>Formal Academic Registry</span>
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#666] font-mono">2020 – 2027</span>
                </div>

                <div className="relative border-l border-[#222] ml-3 space-y-7 pb-2">
                  {education.map((item) => (
                    <div key={item.id} className="relative pl-6 group">
                      {/* Timeline Node Dot with Gold Ring */}
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0A0A0A] border border-[#C5A059] group-hover:bg-[#C5A059] transition-colors" />

                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h4 className="text-sm font-serif font-bold text-[#F2F2F2] group-hover:text-[#C5A059] transition-colors leading-snug">
                          {item.degree}
                        </h4>
                        <span className="shrink-0 px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-[#C5A059] bg-[#1A1A1A] border border-[#333] whitespace-nowrap self-start">
                          {item.score}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-[#999] mb-2">
                        {item.institution}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#666] mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#555]" />
                          {item.period}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#555]" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="space-y-1 text-xs text-[#888] list-disc list-inside">
                          {item.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-[#222] flex items-center justify-between text-[10px] text-[#666] uppercase tracking-widest">
                <span>Verified Records</span>
                <span>Institution Evaluated</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
