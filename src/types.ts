export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  coverImage: string;
  gallery: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  status: 'completed' | 'prototype' | 'in_development';
  featured: boolean;
  sortOrder: number;
  isTemplate?: boolean;
  serviceId?: string | null;
  serviceTitle?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  serviceId?: string | null;
  serviceType: string;
  budget?: string | null;
  timeline?: string | null;
  additionalFeatures?: string | null;
  referenceProject?: string | null;
  message: string;
  status: 'new' | 'in_review' | 'accepted' | 'rejected' | 'contacted' | 'completed' | 'archived';
  createdAt: string;
}

export interface Profile {
  id: string;
  displayName: string;
  headline: string;
  bio: string;
  email: string;
  whatsapp: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
}

export interface DbStatus {
  connected: boolean;
  type: 'neon_postgresql' | 'resilient_local';
  message: string;
  databaseUrlSet: boolean;
  projectCount: number;
  contactCount: number;
}

export interface AdminStats {
  totalProjects: number;
  featuredProjects: number;
  completedProjects: number;
  activeServices: number;
  totalContacts: number;
  newContacts: number;
  inReviewContacts: number;
  completedContacts: number;
}
