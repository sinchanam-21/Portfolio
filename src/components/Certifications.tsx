import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Award, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck 
} from 'lucide-react';

export const Certifications: React.FC = () => {
  const { data, isOwner, setIsEditModalOpen, setEditModalTab, deleteCertification } = usePortfolio();
  const { certifications } = data;

  return (
    <section id="certifications" className="py-20 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-mono block mb-2">
              04 // Professional Credentials
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F2F2F2] tracking-tight">
              Certifications & Industry Credentials
            </h2>
            <p className="text-[#999] text-xs mt-1 max-w-xl font-sans">
              Specialized technical certifications in Cybersecurity, AI tools, and production engineering paradigms.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => {
                setEditModalTab('certifications');
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition self-start md:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Certification
            </button>
          )}
        </div>

        {/* Certifications Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#0F0F0F] border border-[#222] hover:border-[#333] rounded-lg p-6 transition-all duration-300 flex flex-col justify-between group relative shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222]">
                  <div className="p-2 rounded bg-[#161616] border border-[#2A2A2A] text-[#C5A059] group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove certification "${cert.title}"?`)) {
                          deleteCertification(cert.id);
                        }
                      }}
                      className="text-[#666] hover:text-rose-400 p-1"
                      title="Delete certification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-serif font-bold text-[#F2F2F2] mb-1.5 leading-snug group-hover:text-[#C5A059] transition-colors">
                  {cert.title}
                </h3>

                <p className="text-xs font-semibold text-[#BBB] mb-3">
                  {cert.issuer}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-[#666] mb-4">
                  <Calendar className="w-3 h-3 text-[#555]" />
                  <span>Completed: {cert.issueDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E1E1E] flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Credential
                </span>

                {cert.badgeCode && (
                  <span className="text-[10px] font-mono text-[#666] bg-[#161616] px-2 py-0.5 rounded border border-[#2A2A2A]">
                    {cert.badgeCode}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
