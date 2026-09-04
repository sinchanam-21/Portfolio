import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  CheckCircle,
  Terminal,
  ShieldAlert,
  FileCheck2,
  BookOpen
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { data, isOwner, setIsEditModalOpen, setEditModalTab, deleteProject } = usePortfolio();
  const { projects } = data;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'AI & ML', 'Systems & DB'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const getProjectIcon = (title: string) => {
    if (title.toLowerCase().includes('nexus') || title.toLowerCase().includes('security')) {
      return <ShieldAlert className="w-4 h-4 text-[#C5A059]" />;
    }
    if (title.toLowerCase().includes('resume')) {
      return <FileCheck2 className="w-4 h-4 text-[#C5A059]" />;
    }
    if (title.toLowerCase().includes('library') || title.toLowerCase().includes('book')) {
      return <BookOpen className="w-4 h-4 text-[#C5A059]" />;
    }
    return <FolderGit2 className="w-4 h-4 text-[#C5A059]" />;
  };

  return (
    <section id="projects" className="py-20 bg-[#0D0D0D] border-t border-b border-[#222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-mono block mb-2">
              03 // Featured Projects Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F2F2F2] tracking-tight">
              Featured Engineering Projects
            </h2>
            <p className="text-[#999] text-xs mt-1 max-w-xl font-sans">
              Production architectures, machine learning pipelines, and relational database systems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isOwner && (
              <button
                id="add-project-owner-btn"
                onClick={() => {
                  setEditModalTab('projects');
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Project
              </button>
            )}
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C5A059] text-black font-semibold border border-[#C5A059]'
                  : 'bg-[#1A1A1A] text-[#999] hover:text-white hover:bg-[#222] border border-[#333]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0F0F0F] border border-[#222] hover:border-[#333] rounded-lg p-6 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-lg"
            >
              <div>
                {/* Top Row: Category badge & Actions */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#222]">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-[#161616] border border-[#2A2A2A]">
                      {getProjectIcon(project.title)}
                    </span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#161616] text-[#C5A059] border border-[#2A2A2A] uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Owner Controls */}
                  {isOwner && (
                    <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded border border-[#333]">
                      <button
                        onClick={() => {
                          setEditModalTab('projects');
                          setIsEditModalOpen(true);
                        }}
                        className="p-1 text-[#C5A059] hover:text-white rounded"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${project.title}"?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1 text-rose-400 hover:text-white rounded"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-serif font-bold text-[#F2F2F2] group-hover:text-[#C5A059] transition-colors mb-1.5">
                  {project.title}
                </h3>

                {project.role && (
                  <div className="text-xs text-[#999] mb-3 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-[#666]" />
                    <span>Role: {project.role}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-[#BBB] text-xs leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="space-y-1.5 mb-5">
                    {project.highlights.slice(0, 2).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#888]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0 mt-1.5" />
                        <span className="line-clamp-2">{hl}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-[#1E1E1E]">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1A1A1A] text-[#BBB] border border-[#2A2A2A]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action Links */}
                <div className="flex items-center gap-2.5">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded text-xs font-medium bg-[#1A1A1A] hover:bg-[#222] text-[#EEE] hover:text-white border border-[#333] hover:border-[#C5A059] transition flex items-center justify-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Source Repository</span>
                  </a>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded text-xs font-medium border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition flex items-center justify-center gap-1"
                      title="View Project Links"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
