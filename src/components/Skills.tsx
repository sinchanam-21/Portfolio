import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Code, 
  Brain, 
  Layers, 
  Database, 
  Wrench, 
  Users, 
  Edit3, 
  Plus, 
  Trash2,
  Cpu
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { data, isOwner, setIsEditModalOpen, setEditModalTab, deleteSkill } = usePortfolio();
  const { skills } = data;

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'skill-programming':
        return <Code className="w-4 h-4 text-[#C5A059]" />;
      case 'skill-aiml':
        return <Brain className="w-4 h-4 text-[#C5A059]" />;
      case 'skill-frameworks':
        return <Layers className="w-4 h-4 text-[#C5A059]" />;
      case 'skill-database':
        return <Database className="w-4 h-4 text-[#C5A059]" />;
      case 'skill-platforms':
        return <Wrench className="w-4 h-4 text-[#C5A059]" />;
      case 'skill-soft':
        return <Users className="w-4 h-4 text-[#C5A059]" />;
      default:
        return <Cpu className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  const filteredCategories = activeCategoryFilter === 'all' 
    ? skills 
    : skills.filter(c => c.id === activeCategoryFilter);

  return (
    <section id="skills" className="py-20 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-mono block mb-2">
              02 // Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F2F2F2] tracking-tight">
              Skills & Engineering Stack
            </h2>
            <p className="text-[#999] text-xs mt-1 max-w-xl font-sans">
              Verified proficiency across foundational algorithms, neural networks, database architecture, and cloud deployment pipelines.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => {
                setEditModalTab('skills');
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition self-start md:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Manage Skills
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider transition shrink-0 cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-[#C5A059] text-black font-semibold border border-[#C5A059]'
                : 'bg-[#1A1A1A] text-[#999] hover:text-white hover:bg-[#222] border border-[#333]'
            }`}
          >
            All Categories
          </button>
          {skills.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider transition shrink-0 cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#C5A059] text-black font-semibold border border-[#C5A059]'
                  : 'bg-[#1A1A1A] text-[#999] hover:text-white hover:bg-[#222] border border-[#333]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-[#0F0F0F] border border-[#222] hover:border-[#333] rounded-lg p-6 transition-all duration-300 flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#222]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-[#161616] border border-[#2A2A2A]">
                      {getCategoryIcon(category.id)}
                    </div>
                    <h3 className="font-serif font-bold text-[#F2F2F2] text-sm">
                      {category.name}
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#666] font-mono">
                    {category.skills.length} competencies
                  </span>
                </div>

                {/* Skill Badges List */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium bg-[#1A1A1A] border border-[#2A2A2A] text-[#D1D1D1] hover:border-[#C5A059]/60 hover:text-white transition group/pill relative"
                    >
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className="text-[9px] uppercase font-mono text-[#C5A059] px-1 rounded bg-[#111]">
                          {skill.level}
                        </span>
                      )}
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSkill(category.id, skill.name);
                          }}
                          className="text-[#666] hover:text-red-400 ml-1 p-0.5"
                          title={`Delete ${skill.name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={() => {
                    setEditModalTab('skills');
                    setIsEditModalOpen(true);
                  }}
                  className="mt-5 text-xs text-[#C5A059] hover:text-[#E4C586] flex items-center gap-1 font-semibold pt-3 border-t border-[#222] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add skill to {category.name}</span>
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
