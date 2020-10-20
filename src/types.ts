export type AccessLevel = 10 | 20 | 30 | 40 | 50;

export type Member = {
  id: number;
  // username: string;
  access_level: AccessLevel;
};

export type Approver = {
  id: number;
  name: string;
  username: string;
};

export type ApprovalRule = {
  id: number;
  name: string;
  eligible_approvers: Approver[];
  approvals_required: number;
};

export type MergeRequest = {
  target_branch: string;
  project_id: number;
};

export type RulesConfig = {
  projects: ProjectConfig[];
};

export type ProjectConfig = {
  projectIds: number[];
  rules: Rule[];
  groupId: number;
};

export type Rule = {
  branch: (string | 'All')[];
  minLevel: AccessLevel;
  nbReviewers: number;
};
