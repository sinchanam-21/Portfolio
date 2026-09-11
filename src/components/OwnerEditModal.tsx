import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  User, 
  FolderGit2, 
  Brain, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Download, 
  Upload, 
  RotateCcw,
  CheckCircle,
  Key,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Share2,
  Globe
} from 'lucide-react';
import { ProjectItem } from '../types';

export const OwnerEditModal: React.FC = () => {
  const { 
    data, 
    isOwner, 
    isEditModalOpen, 
    setIsEditModalOpen, 
    editModalTab, 
    setEditModalTab,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    deleteSkill,
    updateEducation,
    addEducation,
    deleteEducation,
    addCertification,
    deleteCertification,
    updatePasscode,
    exportDataJson,
    importDataJson,
    resetToDefault,
    showNotification
  } = usePortfolio();

  const [profileForm, setProfileForm] = useState(data.profile);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChangePin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPinMessage(null);
    const trimmedNew = newPasscode.trim();
    const trimmedConfirm = confirmPasscode.trim();

    if (!trimmedNew) {
      setPinMessage({ text: 'Please enter a new PIN.', type: 'error' });
      return;
    }
    if (trimmedNew.length < 4) {
      setPinMessage({ text: 'PIN must be at least 4 characters long.', type: 'error' });
      return;
    }
    if (trimmedNew !== trimmedConfirm) {
      setPinMessage({ text: 'Confirmation PIN does not match. Please re-enter both carefully.', type: 'error' });
      return;
    }

    updatePasscode(trimmedNew);
    setPinMessage({
      text: 'PIN updated successfully! Your new PIN is now active and the default PIN is permanently replaced.',
      type: 'success'
    });
    setNewPasscode('');
    setConfirmPasscode('');
  };
  
  // Project editing state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState<{
    title: string;
    category: 'AI & ML' | 'Web & Cloud' | 'Systems & DB';
    description: string;
    techStack: string;
    highlights: string;
    githubUrl: string;
    liveUrl: string;
    role: string;
    featured: boolean;
  }>({
    title: '',
    category: 'AI & ML',
    description: '',
    techStack: '',
    highlights: '',
    githubUrl: 'https://github.com/sinchanam-21',
    liveUrl: '',
    role: '',
    featured: true
  });

  // Skill editing state
  const [selectedCategoryForSkill, setSelectedCategoryForSkill] = useState(data.skills[0]?.id || 'skill-programming');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  // Certification state
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');

  // Import JSON backup state
  const [importJsonText, setImportJsonText] = useState('');

  if (!isEditModalOpen || !isOwner) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) return;

    addProject({
      title: newProjectForm.title,
      category: newProjectForm.category,
      description: newProjectForm.description,
      role: newProjectForm.role || 'Developer',
      featured: newProjectForm.featured,
      techStack: newProjectForm.techStack.split(',').map(s => s.trim()).filter(Boolean),
      highlights: newProjectForm.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      githubUrl: newProjectForm.githubUrl || 'https://github.com/sinchanam-21',
      liveUrl: newProjectForm.liveUrl || undefined
    });

    setIsAddingProject(false);
    setNewProjectForm({
      title: '',
      category: 'AI & ML',
      description: '',
      techStack: '',
      highlights: '',
      githubUrl: 'https://github.com/sinchanam-21',
      liveUrl: '',
      role: '',
      featured: true
    });
  };

  const handleUpdateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    updateProject(editingProject.id, editingProject);
    setEditingProject(null);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill(selectedCategoryForSkill, {
      name: newSkillName.trim(),
      level: newSkillLevel
    });
    setNewSkillName('');
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;
    addCertification({
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim(),
      issueDate: newCertDate.trim() || '2025'
    });
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertDate('');
  };

  const handleDownloadBackup = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinchana_portfolio_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJson(importJsonText);
    if (ok) {
      setImportJsonText('');
      setIsEditModalOpen(false);
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window === 'undefined') return;
    const currentOrigin = window.location.origin;
    // Transform dev container URL to public shared URL if currently in dev container
    const publicUrl = currentOrigin.replace('ais-dev-', 'ais-pre-');
    navigator.clipboard.writeText(publicUrl);
    showNotification('Public link copied! This link does NOT require login and can be opened by anyone.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#0F0F0F] border border-[#333] w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A0A0A] px-6 py-4 border-b border-[#222] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse" />
            <h3 className="font-serif text-base text-[#F2F2F2]">
              Owner Control Panel • <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider">Sinchana M</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#333] hover:border-[#C5A059] text-[#CCC] hover:text-[#C5A059] rounded bg-[#161616] transition cursor-pointer"
              title="Copy the public link to send to others (no login required)"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Copy Public Link</span>
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1A1A1A] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Server Sync Notice */}
        <div className="bg-[#121212] px-6 py-2 border-b border-[#222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#999]">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span>
              <strong className="text-[#E0E0E0]">Global Live Sync Active:</strong> Edits you save here are automatically published to the server and visible to everyone who opens the link.
            </span>
          </div>
          <button
            onClick={handleCopyShareLink}
            className="sm:hidden text-xs text-[#C5A059] underline cursor-pointer flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" /> Copy Public Link
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#222] bg-[#0A0A0A] overflow-x-auto scrollbar-none px-4 shrink-0">
          {[
            { id: 'profile', label: 'Profile & Bio', icon: User },
            { id: 'projects', label: 'Projects', icon: FolderGit2 },
            { id: 'skills', label: 'Skills', icon: Brain },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'certifications', label: 'Certifications', icon: Award },
            { id: 'security', label: 'Security & Backup', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = editModalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEditModalTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10'
                    : 'border-transparent text-[#777] hover:text-[#BBB] hover:bg-[#141414]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#D1D1D1]">
          
          {/* TAB 1: PROFILE & BIO */}
          {editModalTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">Role / Headline</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">Status Badge</label>
                  <input
                    type="text"
                    value={profileForm.status}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={profileForm.linkedinUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={profileForm.githubUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">Professional Summary</label>
                <textarea
                  rows={4}
                  value={profileForm.summary}
                  onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={profileForm.interests.join(', ')}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-[#EEE] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] hover:bg-[#A88243] text-black transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PROJECTS */}
          {editModalTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm text-[#F2F2F2]">Existing Projects ({data.projects.length})</h4>
                {!isAddingProject && (
                  <button
                    onClick={() => setIsAddingProject(true)}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-[#1A1A1A] text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-black flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {/* Add Project Form */}
              {isAddingProject && (
                <form onSubmit={handleCreateProject} className="bg-[#0A0A0A] p-5 rounded border border-[#C5A059]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059]">New Project Details</h5>
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="text-[#888] hover:text-white text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={newProjectForm.title}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                        placeholder="e.g. Nexus Security AI"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Category</label>
                      <select
                        value={newProjectForm.category}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      >
                        <option value="AI & ML">AI & ML</option>
                        <option value="Systems & DB">Systems & DB</option>
                        <option value="Web & Cloud">Web & Cloud</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newProjectForm.description}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      placeholder="Brief overview of what it does..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        value={newProjectForm.techStack}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, techStack: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                        placeholder="Python, Flask, Gemini API, MySQL"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={newProjectForm.githubUrl}
                        onChange={(e) => setNewProjectForm({ ...newProjectForm, githubUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Key Highlights (1 per line)</label>
                    <textarea
                      rows={2}
                      value={newProjectForm.highlights}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, highlights: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      placeholder="Integrated Google Gemini model...&#10;Calculated dynamic penalty engine..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] hover:bg-[#A88243] text-black transition cursor-pointer"
                  >
                    Save Project
                  </button>
                </form>
              )}

              {/* Edit Existing Project Form */}
              {editingProject && (
                <form onSubmit={handleUpdateProjectSubmit} className="bg-[#0A0A0A] p-5 rounded border border-[#C5A059]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059]">Editing "{editingProject.title}"</h5>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="text-[#888] hover:text-white text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Title</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Category</label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      >
                        <option value="AI & ML">AI & ML</option>
                        <option value="Systems & DB">Systems & DB</option>
                        <option value="Web & Cloud">Web & Cloud</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={editingProject.techStack.join(', ')}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] hover:bg-[#A88243] text-black transition cursor-pointer"
                  >
                    Update Project
                  </button>
                </form>
              )}

              {/* Project Cards List */}
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="bg-[#141414] p-4 rounded border border-[#262626] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#C5A059] bg-[#1C1C1C] px-2 py-0.5 rounded border border-[#C5A059]/40 mr-2">
                        {proj.category}
                      </span>
                      <span className="font-serif font-bold text-[#F2F2F2] text-sm">{proj.title}</span>
                      <p className="text-xs text-[#888] mt-1 line-clamp-1">{proj.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsAddingProject(false);
                        }}
                        className="p-1.5 text-[#C5A059] hover:bg-[#C5A059]/20 rounded text-xs flex items-center gap-1 cursor-pointer transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${proj.title}?`)) deleteProject(proj.id);
                        }}
                        className="p-1.5 text-[#777] hover:text-rose-400 rounded text-xs cursor-pointer transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {editModalTab === 'skills' && (
            <div className="space-y-6">
              {/* Add Skill Form */}
              <form onSubmit={handleAddSkillSubmit} className="bg-[#0A0A0A] p-4 rounded border border-[#2A2A2A] space-y-3">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059]">Add New Skill</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Target Category</label>
                    <select
                      value={selectedCategoryForSkill}
                      onChange={(e) => setSelectedCategoryForSkill(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    >
                      {data.skills.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Skill Name *</label>
                    <input
                      type="text"
                      required
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. Scikit-Learn, Docker"
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Proficiency Level</label>
                    <input
                      type="text"
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                      placeholder="e.g. Advanced, Intermediate"
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] hover:bg-[#A88243] text-black flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill to Category</span>
                </button>
              </form>

              {/* Display all categories and skills with delete buttons */}
              <div className="space-y-4">
                {data.skills.map((cat) => (
                  <div key={cat.id} className="bg-[#141414] p-4 rounded border border-[#262626]">
                    <h5 className="font-serif font-bold text-xs text-[#F2F2F2] uppercase mb-3 flex items-center justify-between">
                      <span>{cat.name}</span>
                      <span className="text-[11px] font-mono text-[#777]">{cat.skills.length} items</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-[#D1D1D1]"
                        >
                          <span>{s.name}</span>
                          <button
                            type="button"
                            onClick={() => deleteSkill(cat.id, s.name)}
                            className="text-[#666] hover:text-rose-400 ml-1 p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {editModalTab === 'education' && (
            <div className="space-y-4">
              <h4 className="font-serif text-sm text-[#F2F2F2]">Education History</h4>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="bg-[#141414] p-4 rounded border border-[#262626] space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Degree / Level</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          className="w-full px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Score / CGPA</label>
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) => updateEducation(edu.id, { score: e.target.value })}
                          className="w-full px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          className="w-full px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Period</label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => updateEducation(edu.id, { period: e.target.value })}
                          className="w-full px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATIONS */}
          {editModalTab === 'certifications' && (
            <div className="space-y-6">
              <form onSubmit={handleAddCertSubmit} className="bg-[#0A0A0A] p-4 rounded border border-[#2A2A2A] space-y-3">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059]">Add New Certification</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={newCertTitle}
                      onChange={(e) => setNewCertTitle(e.target.value)}
                      placeholder="e.g. Deep Learning Specialization"
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Issuer *</label>
                    <input
                      type="text"
                      required
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      placeholder="e.g. Coursera / DeepLearning.AI"
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">Date</label>
                    <input
                      type="text"
                      value={newCertDate}
                      onChange={(e) => setNewCertDate(e.target.value)}
                      placeholder="e.g. Nov 2025"
                      className="w-full px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] hover:bg-[#A88243] text-black flex items-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Certification</span>
                </button>
              </form>

              <div className="space-y-3">
                {data.certifications.map((c) => (
                  <div key={c.id} className="bg-[#141414] p-4 rounded border border-[#262626] flex items-center justify-between">
                    <div>
                      <h5 className="font-serif font-bold text-[#F2F2F2] text-sm">{c.title}</h5>
                      <p className="text-xs text-[#888]">{c.issuer} • {c.issueDate}</p>
                    </div>
                    <button
                      onClick={() => deleteCertification(c.id)}
                      className="p-1.5 text-[#777] hover:text-rose-400 rounded cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & BACKUP */}
          {editModalTab === 'security' && (
            <div className="space-y-6">
              
              {/* Passcode update */}
              <div className="bg-[#0A0A0A] p-5 rounded border border-[#2A2A2A] space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-serif text-sm text-[#F2F2F2] flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#C5A059]" />
                    <span>Change Private Owner PIN</span>
                  </h5>
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider bg-[#161616] px-2 py-0.5 rounded border border-[#333]">
                    Restricted Access
                  </span>
                </div>

                <p className="text-xs text-[#888] leading-relaxed">
                  Set a private security PIN known only to you. Once saved, all previous default PINs are completely revoked, and only your new PIN can unlock edit mode.
                </p>

                {/* Current PIN masked display */}
                <div className="flex items-center justify-between bg-[#121212] px-3.5 py-2.5 rounded border border-[#222]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#777]" />
                    <span className="text-xs text-[#888]">Current Active PIN:</span>
                    <span className="font-mono text-xs text-[#C5A059] font-bold tracking-widest ml-1">
                      {showCurrentPin ? data.ownerPasscodeHash : '••••••••'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="text-[11px] text-[#999] hover:text-[#C5A059] cursor-pointer flex items-center gap-1"
                  >
                    {showCurrentPin ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Reveal</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Inputs for New PIN and Confirm */}
                <form onSubmit={handleChangePin} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">
                        New Owner PIN (min 4 chars)
                      </label>
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={newPasscode}
                        onChange={(e) => {
                          setNewPasscode(e.target.value);
                          if (pinMessage) setPinMessage(null);
                        }}
                        placeholder="Enter new private PIN"
                        className="w-full px-3 py-2 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#888] mb-1">
                        Confirm New PIN
                      </label>
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={confirmPasscode}
                        onChange={(e) => {
                          setConfirmPasscode(e.target.value);
                          if (pinMessage) setPinMessage(null);
                        }}
                        placeholder="Re-type new private PIN"
                        className="w-full px-3 py-2 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-white focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="text-[11px] text-[#777] hover:text-[#BBB] flex items-center gap-1 cursor-pointer"
                    >
                      {showNewPin ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hide Typed Characters</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Show Typed Characters</span>
                        </>
                      )}
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] text-black hover:bg-[#A88243] cursor-pointer transition flex items-center gap-1.5 shadow-md shadow-black/40"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Activate PIN</span>
                    </button>
                  </div>

                  {pinMessage && (
                    <div
                      className={`p-3 rounded text-xs flex items-center gap-2 border ${
                        pinMessage.type === 'success'
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      }`}
                    >
                      {pinMessage.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      )}
                      <span>{pinMessage.text}</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Backup & Restore */}
              <div className="bg-[#0A0A0A] p-5 rounded border border-[#2A2A2A] space-y-4">
                <h5 className="font-serif text-sm text-[#F2F2F2] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  <span>Export / Import Portfolio Data (JSON)</span>
                </h5>
                <p className="text-xs text-[#888]">
                  Save all your edits to a JSON file on your machine or restore from an earlier backup.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2 rounded text-xs font-medium bg-[#141414] hover:bg-[#1A1A1A] text-[#EEE] border border-[#333] hover:border-[#C5A059] flex items-center gap-2 cursor-pointer transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Reset portfolio back to Sinchana M original resume data?')) {
                        resetToDefault();
                      }
                    }}
                    className="px-4 py-2 rounded text-xs font-medium bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 border border-rose-900/40 flex items-center gap-2 cursor-pointer transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Original Resume</span>
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#888] mb-1">
                    Paste JSON Backup to Restore:
                  </label>
                  <textarea
                    rows={3}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder="Paste exported JSON content here..."
                    className="w-full px-3 py-2 rounded bg-[#141414] border border-[#2A2A2A] text-xs font-mono text-[#D1D1D1] focus:border-[#C5A059] focus:outline-none"
                  />
                  <button
                    onClick={handleImportBackup}
                    disabled={!importJsonText.trim()}
                    className="mt-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] text-black hover:bg-[#A88243] disabled:opacity-40 cursor-pointer transition"
                  >
                    Apply Backup JSON
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
