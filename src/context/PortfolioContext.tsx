import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioState,
  ProfileData,
  ProjectItem,
  EducationItem,
  CertificationItem,
  ContactMessage,
} from '../types';
import { initialPortfolioData } from '../data/initialPortfolio';

interface PortfolioContextType {
  data: PortfolioState;
  isOwner: boolean;
  unlockOwner: (passcode: string) => boolean;
  lockOwner: () => void;
  updatePasscode: (newPasscode: string) => void;
  updateProfile: (profile: Partial<ProfileData>) => void;
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  addSkill: (categoryId: string, skill: { name: string; level?: string }) => void;
  deleteSkill: (categoryId: string, skillName: string) => void;
  updateEducation: (id: string, edu: Partial<EducationItem>) => void;
  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  deleteEducation: (id: string) => void;
  addCertification: (cert: Omit<CertificationItem, 'id'>) => void;
  deleteCertification: (id: string) => void;
  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  resetToDefault: () => void;
  // Modal states
  isResumeModalOpen: boolean;
  setIsResumeModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editModalTab: 'profile' | 'projects' | 'skills' | 'education' | 'certifications' | 'security';
  setEditModalTab: (tab: 'profile' | 'projects' | 'skills' | 'education' | 'certifications' | 'security') => void;
  isMessagesDrawerOpen: boolean;
  setIsMessagesDrawerOpen: (open: boolean) => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const STORAGE_KEY = 'sinchana_portfolio_data_v4';
const OWNER_AUTH_KEY = 'sinchana_portfolio_owner_auth';
const SECURE_PIN_STORAGE_KEY = 'sinchana_portfolio_owner_pin_secure';

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioState>(() => {
    try {
      const savedPin = typeof window !== 'undefined' ? localStorage.getItem(SECURE_PIN_STORAGE_KEY) : null;
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('sinchana_portfolio_data_v3') || localStorage.getItem('sinchana_portfolio_data_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Ensure education contains the updated volleyball & drawing points
        let education = initialPortfolioData.education;
        if (parsed.education?.length) {
          // If user customized education in owner mode, check if outdated
          const hasOutdatedSports = parsed.education.some((edu: EducationItem) =>
            edu.highlights?.some((h: string) => h.toLowerCase().includes('athlete') || h.toLowerCase().includes('state-level sports representations'))
          );
          if (!hasOutdatedSports) {
            education = parsed.education;
          }
        }

        return {
          ...initialPortfolioData,
          ...parsed,
          profile: { 
            ...initialPortfolioData.profile, 
            ...parsed.profile,
            status: 'Available for Internships',
            interests: initialPortfolioData.profile.interests,
            achievements: initialPortfolioData.profile.achievements
          },
          education,
          skills: parsed.skills?.length ? parsed.skills : initialPortfolioData.skills,
          projects: parsed.projects?.length ? parsed.projects : initialPortfolioData.projects,
          certifications: parsed.certifications?.length ? parsed.certifications : initialPortfolioData.certifications,
          contactMessages: parsed.contactMessages || [],
          ownerPasscodeHash: savedPin || parsed.ownerPasscodeHash || initialPortfolioData.ownerPasscodeHash
        };
      }
    } catch (e) {
      console.warn('Could not parse stored portfolio data, using defaults', e);
    }
    const savedPin = typeof window !== 'undefined' ? localStorage.getItem(SECURE_PIN_STORAGE_KEY) : null;
    return {
      ...initialPortfolioData,
      ownerPasscodeHash: savedPin || initialPortfolioData.ownerPasscodeHash
    };
  });

  const [isOwner, setIsOwner] = useState<boolean>(() => {
    return sessionStorage.getItem(OWNER_AUTH_KEY) === 'true';
  });

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState<'profile' | 'projects' | 'skills' | 'education' | 'certifications' | 'security'>('profile');
  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio state', e);
    }
  }, [data]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const unlockOwner = (passcode: string): boolean => {
    const trimmed = passcode.trim();
    const storedPin = typeof window !== 'undefined' ? localStorage.getItem(SECURE_PIN_STORAGE_KEY) : null;
    const activePasscode = storedPin || data.ownerPasscodeHash;

    if (trimmed && trimmed === activePasscode) {
      setIsOwner(true);
      sessionStorage.setItem(OWNER_AUTH_KEY, 'true');
      showNotification('Owner access verified! You can now edit any section.', 'success');
      return true;
    }
    showNotification('Incorrect PIN. Access restricted to Sinchana M.', 'error');
    return false;
  };

  const lockOwner = () => {
    setIsOwner(false);
    sessionStorage.removeItem(OWNER_AUTH_KEY);
    setIsEditModalOpen(false);
    setIsMessagesDrawerOpen(false);
    showNotification('Owner mode locked. Public preview enabled.', 'info');
  };

  const updatePasscode = (newPasscode: string) => {
    const trimmed = newPasscode.trim();
    if (!trimmed || trimmed.length < 4) {
      showNotification('PIN must be at least 4 characters.', 'error');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(SECURE_PIN_STORAGE_KEY, trimmed);
    }
    setData((prev) => ({
      ...prev,
      ownerPasscodeHash: trimmed,
    }));
    showNotification('Owner PIN successfully updated and secured!', 'success');
  };

  const updateProfile = (profileUpdate: Partial<ProfileData>) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileUpdate,
      },
    }));
    showNotification('Profile information saved.', 'success');
  };

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newId = 'proj-' + Date.now();
    setData((prev) => ({
      ...prev,
      projects: [{ ...project, id: newId }, ...prev.projects],
    }));
    showNotification(`Added project "${project.title}".`, 'success');
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
    showNotification('Project updated.', 'success');
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    showNotification('Project removed.', 'info');
  };

  const addSkill = (categoryId: string, skill: { name: string; level?: string }) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: [...cat.skills, skill],
          };
        }
        return cat;
      }),
    }));
    showNotification(`Skill "${skill.name}" added.`, 'success');
  };

  const deleteSkill = (categoryId: string, skillName: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: cat.skills.filter((s) => s.name !== skillName),
          };
        }
        return cat;
      }),
    }));
    showNotification(`Removed "${skillName}".`, 'info');
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    }));
    showNotification('Education entry updated.', 'success');
  };

  const addEducation = (edu: Omit<EducationItem, 'id'>) => {
    const newId = 'edu-' + Date.now();
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { ...edu, id: newId }],
    }));
    showNotification('Education record added.', 'success');
  };

  const deleteEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
    showNotification('Education record deleted.', 'info');
  };

  const addCertification = (cert: Omit<CertificationItem, 'id'>) => {
    const newId = 'cert-' + Date.now();
    setData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { ...cert, id: newId }],
    }));
    showNotification(`Certification "${cert.title}" added.`, 'success');
  };

  const deleteCertification = (id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
    showNotification('Certification deleted.', 'info');
  };

  const submitContactMessage = (msg: { name: string; email: string; subject: string; message: string }) => {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      ...msg,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isRead: false
    };

    setData((prev) => ({
      ...prev,
      contactMessages: [newMsg, ...(prev.contactMessages || [])],
    }));
    showNotification('Thank you! Your message has been sent successfully.', 'success');
  };

  const markMessageRead = (id: string) => {
    setData((prev) => ({
      ...prev,
      contactMessages: prev.contactMessages.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
    }));
  };

  const deleteMessage = (id: string) => {
    setData((prev) => ({
      ...prev,
      contactMessages: prev.contactMessages.filter((m) => m.id !== id),
    }));
    showNotification('Message deleted.', 'info');
  };

  const exportDataJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.profile && parsed.skills && parsed.projects) {
        setData(parsed);
        showNotification('Portfolio data restored from backup.', 'success');
        return true;
      }
      showNotification('Invalid backup file format.', 'error');
      return false;
    } catch {
      showNotification('Could not parse JSON backup file.', 'error');
      return false;
    }
  };

  const resetToDefault = () => {
    setData(initialPortfolioData);
    showNotification('Portfolio reset to initial resume data.', 'info');
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isOwner,
        unlockOwner,
        lockOwner,
        updatePasscode,
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
        submitContactMessage,
        markMessageRead,
        deleteMessage,
        exportDataJson,
        importDataJson,
        resetToDefault,
        isResumeModalOpen,
        setIsResumeModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        editModalTab,
        setEditModalTab,
        isMessagesDrawerOpen,
        setIsMessagesDrawerOpen,
        notification,
        showNotification,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
