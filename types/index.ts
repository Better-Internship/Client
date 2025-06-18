// Basic types for BetterInternship platform
// This file provides minimal types to resolve import errors

export interface PublicUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  taking_for_credit?: boolean;
  linkage_officer?: string;
}

export interface PublicEmployerUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  salary?: string;
  responsibilities?: string;
  created_at: string;
  updated_at: string;
}

export interface StatusResponse {
  success: boolean;
  message?: string;
  data?: any;
  job?: Job;
}

export interface MenuItem {
  href: string;
  label: string;
  Icon?: any;
  active?: boolean;
  submenus?: MenuItem[];
  has_notifications?: boolean;
  should_show?: boolean;
}

// Portal types
export type Portal = "student" | "hire" | "school";

// Component props
export interface PortalComponentProps {
  portal?: Portal;
  className?: string;
}

// Form types
export interface FormData {
  [key: string]: any;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// File types
export interface FileUpload {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

// Date utilities
export type DateInput = string | Date | number;

// Academic year
export interface AcademicYear {
  id: string;
  year: string;
  start_date: string;
  end_date: string;
}

// Company
export interface Company {
  id: string;
  name: string;
  description?: string;
  location?: string;
  website?: string;
}

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
}

// Feedback
export interface Feedback {
  id: string;
  student_id: string;
  company_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Export all types for easy importing
export type {
  PublicUser,
  PublicEmployerUser,
  Job,
  StatusResponse,
  MenuItem,
  Portal,
  PortalComponentProps,
  FormData,
  ApiResponse,
  FileUpload,
  DateInput,
  AcademicYear,
  Company,
  Department,
  Feedback
};
