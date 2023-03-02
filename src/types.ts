export interface RMineState {
  lastProjects: number[];
  statuses?: Record<string, number>;
  apiKey?: string;
  url?: string;
}

export interface Project {
  id: number;
  name: string;
  identifier: string;
  description: string;
  status: number;
  is_public: boolean;
  inherit_members: boolean;
  created_on: string;
  updated_on: string;
  parent?: Project;
}

export interface IssueStatus {
  id: number;
  name: string;
  is_closed: boolean;
}

export interface Tracker {
  id: number;
  name: string;
  default_status?: IssueStatus;
  description?: string;
  enabled_standard_fields: string[];
}

export interface Issue {
  id: number;
  project: Pick<Project, "id" | "name">;
  tracker: Pick<Tracker, "id" | "name">;
  status: IssueStatus;
  priority: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  subject: string;
  description: string;
  start_date: string;
  due_date?: string | null;
  done_ratio: number;
  is_private: boolean;
  estimated_hours: number | null;
  total_estimated_hours: number | null;
  spent_hours: number;
  total_spent_hours: number;
  created_on: string;
  updated_on: string;
  closed_on?: string | null;
}
