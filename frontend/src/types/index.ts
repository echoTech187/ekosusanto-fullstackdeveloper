export type Role = 'JOB_SEEKER' | 'COMPANY';

export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  salary: string;
  jobType: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    applications: number;
  };
}

export interface ApplicationHistory {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedById: string;
  notes?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job: Job;
  seeker?: {
    id: string;
    name: string;
    email: string;
  };
  histories: ApplicationHistory[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
