export type AccessLevel = 10 | 20 | 30 | 40 | 50;

export type Member = {
  id: number;
  username: string;
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
