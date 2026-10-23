export type UserRole = 'student' | 'admin';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  branch: string;
  currentYear: string; // '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
  cgpa: number;
  technicalSkills: string[];
  preferredJobRoles: string[];
  certifications: {
    id: string;
    title: string;
    issuer: string;
    year: string;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  resumeName?: string;
  resumeUrl?: string;
  careerInterests: string[];
  avatarUrl?: string;
  phoneNumber?: string;
  readinessScores: {
    technicalSkills: number;
    communicationSkills: number;
    aptitude: number;
    codingPractice: number;
    resumeQuality: number;
    interviewPrep: number;
  };
}

export interface Opportunity {
  id: string;
  company: string;
  logo: string;
  companyColor: string;
  role: string;
  jobType: 'Full Time' | 'Internship' | 'Intern + PPO';
  ctcLpa: number;
  stipendPerMonth?: number;
  location: string;
  eligibleBranches: string[];
  minCgpa: number;
  requiredSkills: string[];
  preferredSkills: string[];
  applicationDeadline: string; // YYYY-MM-DD
  driveDate: string;
  description: string;
  openings: number;
  selectionProcess: string[];
  perks: string[];
  tier: 'Dream (20+ LPA)' | 'Super Dream (10-20 LPA)' | 'Core / Mass (3-10 LPA)';
  isActive: boolean;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  company: string;
  role: string;
  appliedDate: string;
  status: ApplicationStatus;
  interviewDate?: string;
  notes?: string;
  salaryLpa: number;
  location: string;
  timeline: {
    status: ApplicationStatus;
    date: string;
    note?: string;
  }[];
}

export interface SkillGapItem {
  skill: string;
  category: 'Core Computer Science' | 'Programming Language' | 'Framework & Web' | 'Cloud & DevOps' | 'Data & AI';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPossessed: boolean;
  isRequired: boolean;
  learningResources: {
    title: string;
    provider: string;
    type: 'Course' | 'Interactive Problem' | 'Documentation' | 'Video Series';
    estimatedHours: number;
    link: string;
  }[];
  userStatus: 'Not Started' | 'In Progress' | 'Mastered';
}

export interface RecommendationResult {
  opportunity: Opportunity;
  matchScore: number; // 0 - 100
  skillMatchPercentage: number;
  isCgpaEligible: boolean;
  isBranchEligible: boolean;
  isRolePreferred: boolean;
  overallEligibility: 'Eligible' | 'Borderline' | 'Ineligible';
  matchedSkills: string[];
  missingSkills: string[];
  reasoningNotes: string[];
}

export interface PlacementNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'drive' | 'shortlist' | 'deadline' | 'system';
  opportunityId?: string;
}
