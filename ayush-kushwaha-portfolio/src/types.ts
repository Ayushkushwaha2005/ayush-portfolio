export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  bio: string;
  avatarUrl: string;
}

export interface Education {
  institution: string;
  degree: string;
  specialization?: string;
  period: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  metric?: string;
}

export interface Achievement {
  title: string;
  organization: string;
  year?: string;
  highlight?: boolean;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: SkillGroup[];
  projects: Project[];
  achievements: Achievement[];
}
