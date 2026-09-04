export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  score: string;
  location?: string;
  highlights?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'AI & ML' | 'Web & Cloud' | 'Systems & DB';
  description: string;
  highlights: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  role?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: {
    name: string;
    level?: string;
    iconName?: string;
  }[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  badgeCode?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ProfileData {
  name: string;
  tagline: string;
  role: string;
  status: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  resumeDownloadUrl?: string;
  summary: string;
  interests: string[];
  achievements: string[];
}

export interface PortfolioState {
  profile: ProfileData;
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  contactMessages: ContactMessage[];
  ownerPasscodeHash: string;
}
