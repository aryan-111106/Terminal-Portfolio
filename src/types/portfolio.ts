export interface ProjectItem {
  id: string;
  name: string;
  category: 'Full Stack' | 'Systems / CLI' | 'AI / ML' | 'Frontend' | 'Mobile' | 'Open Source';
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  stars?: number;
  stats?: string;
}

export interface SkillCategory {
  category: string;
  icon?: string;
  skills: {
    name: string;
    level: number; // 1 to 100
    description?: string;
  }[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
  current?: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  details?: string[];
}

export interface SocialLink {
  platform: string;
  username: string;
  url: string;
  icon?: string;
}

export interface PortfolioConfig {
  name: string;
  title: string;
  handle: string;
  hostname: string;
  email: string;
  location: string;
  asciiPortrait?: string;
  asciiName?: string;
  welcomeTagline?: string;
  welcomeSubtitle?: string;
  bio: string[];
  about: {
    summary: string;
    passions: string[];
    currentFocus: string;
    funFact: string;
  };
  skills: SkillCategory[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications?: {
    title: string;
    issuer: string;
    year?: string;
  }[];
  awards?: {
    title: string;
    issuer?: string;
    year?: string;
  }[];
  socials: SocialLink[];
  resumeUrl?: string;
  easterEggs: {
    cowsayDefault: string;
    motd: string;
    quotes: string[];
  };
}
