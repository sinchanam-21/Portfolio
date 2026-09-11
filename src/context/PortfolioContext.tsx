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
        
        let education = initialPortfolioData.education;
        if (parsed.education?.length) {
          education = parsed.education;
        }

        return {
          ...initialPortfolioData,
          ...parsed,
          profile: { 
            ...initialPortfolioData.profile, 
            ...parsed.profile,
            status: parsed.profile?.status || initialPortfolioData.profile.status,
            interests: parsed.profile?.interests?.length ? parsed.profile.interests : initialPortfolioData.profile.interests,
            achievements: parsed.profile?.achievements?.length ? parsed.profile.achievements : initialPortfolioData.profile.achievements
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
    return typeof window !== 'undefined' && sessionStorage.getItem(OWNER_AUTH_KEY) === 'true';
  });

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState<'profile' | 'projects' | 'skills' | 'education' | 'certifications' | 'security'>('profile');
  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync with central server on mount so everyone sees the latest saved portfolio
  useEffect(() => {
    let isMounted = true;
    async function loadServerPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && json.data && isMounted) {
            const serverData: PortfolioState = json.data;
            const savedPin = localStorage.getItem(SECURE_PIN_STORAGE_KEY);
            setData((prev) => ({
              ...prev,
              ...serverData,
              profile: {
                ...prev.profile,
                ...serverData.profile,
              },
              education: serverData.education?.length ? serverData.education : prev.education,
              skills: serverData.skills?.length ? serverData.skills : prev.skills,
              projects: serverData.projects?.length ? serverData.projects : prev.projects,
              certifications: serverData.certifications?.length ? serverData.certifications : prev.certifications,
              ownerPasscodeHash: savedPin || prev.ownerPasscodeHash,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch server portfolio, utilizing cached state', err);
      }
    }
    loadServerPortfolio();

    // Check for query parameters (?edit=true or ?admin=true)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('edit') === 'true' || urlParams.get('admin') === 'true') {
        const savedPin = localStorage.getItem(SECURE_PIN_STORAGE_KEY);
        if (savedPin) {
          setIsOwner(true);
          sessionStorage.setItem(OWNER_AUTH_KEY, 'true');
        } else {
          setIsAuthModalOpen(true);
        }
      }

      // Keyboard shortcut Ctrl+Shift+E or Alt+E to open owner auth
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') || (e.altKey && e.key.toLowerCase() === 'e')) {
          e.preventDefault();
          setIsAuthModalOpen(true);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        isMounted = false;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to persist changes both to localStorage and the server
  const persistChanges = async (nextState: PortfolioState, customPin?: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    // Push to central server so ALL visitors see the changes
    try {
      const activePin = (customPin || localStorage.getItem(SECURE_PIN_STORAGE_KEY) || nextState.ownerPasscodeHash || '21005').trim();
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-pin': activePin,
        },
        body: JSON.stringify(nextState),
      });
      if (!res.ok) {
        console.warn('Server sync returned non-200 status', res.status);
      }
    } catch (err) {
      console.warn('Server sync error (saved locally)', err);
    }
  };

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
    const activePasscode = (storedPin || data.ownerPasscodeHash || '21005').trim();

    if (trimmed && trimmed === activePasscode) {
      setIsOwner(true);
      sessionStorage.setItem(OWNER_AUTH_KEY, 'true');
      if (typeof window !== 'undefined') {
        localStorage.setItem(SECURE_PIN_STORAGE_KEY, trimmed);
      }
      showNotification('Owner access verified! Changes you make will be visible to everyone.', 'success');
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
    showNotification('Owner mode locked. Public view enabled.', 'info');
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
    const updatedState = {
      ...data,
      ownerPasscodeHash: trimmed,
    };
    setData(updatedState);
    persistChanges(updatedState, trimmed);
    showNotification('Owner PIN successfully updated and saved!', 'success');
  };

  const updateProfile = (profileUpdate: Partial<ProfileData>) => {
    const updatedState = {
      ...data,
      profile: {
        ...data.profile,
        ...profileUpdate,
      },
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification('Profile information saved and published to everyone.', 'success');
  };

  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newId = 'proj-' + Date.now();
    const updatedState = {
      ...data,
      projects: [{ ...project, id: newId }, ...data.projects],
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification(`Added project "${project.title}" and published live.`, 'success');
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    const updatedState = {
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification('Project updated and published live.', 'success');
  };

  const deleteProject = (id: string) => {
    const updatedState = {
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification('Project removed and updated.', 'info');
  };

  const addSkill = (categoryId: string, skill: { name: string; level?: string }) => {
    const updatedState = {
      ...data,
      skills: data.skills.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: [...cat.skills, skill],
          };
        }
        return cat;
      }),
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification(`Skill "${skill.name}" added and saved.`, 'success');
  };

  const deleteSkill = (categoryId: string, skillName: string) => {
    const updatedState = {
      ...data,
      skills: data.skills.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: cat.skills.filter((s) => s.name !== skillName),
          };
        }
        return cat;
      }),
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification(`Removed "${skillName}".`, 'info');
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    const updatedState = {
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification('Education entry updated and published.', 'success');
  };

  const addEducation = (edu: Omit<EducationItem, 'id'>) => {
    const newId = 'edu-' + Date.now();
    const updatedState = {
      ...data,
      education: [...data.education, { ...edu, id: newId }],
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification('Education record added and published.', 'success');
  };

  const deleteEducation = (id: string) => {
    const updatedState = {
      ...data,
      education: data.education.filter((e) => e.id !== id),
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification('Education record deleted.', 'info');
  };

  const addCertification = (cert: Omit<CertificationItem, 'id'>) => {
    const newId = 'cert-' + Date.now();
    const updatedState = {
      ...data,
      certifications: [...data.certifications, { ...cert, id: newId }],
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification(`Certification "${cert.title}" added and published.`, 'success');
  };

  const deleteCertification = (id: string) => {
    const updatedState = {
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id),
    };
    setData(updatedState);
    persistChanges(updatedState);
    showNotification('Certification deleted.', 'info');
  };

  const submitContactMessage = async (msg: { name: string; email: string; subject: string; message: string }) => {
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

    const updatedState = {
      ...data,
      contactMessages: [newMsg, ...(data.contactMessages || [])],
    };
    setData(updatedState);
    persistChanges(updatedState);

    // Also post to inquiry endpoint for redundancy
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
    } catch {
      // already saved locally/via state
    }
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
