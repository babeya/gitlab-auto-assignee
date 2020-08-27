import { get } from "./utils";

type Approver = {
  id: number;
  name: string;
  username: string;
};

type ApprovalRule = {
  id: number;
  name: string;
  eligible_approvers: Approver[];
  approvals_required: number;
};

const getMrApprovalRulesPath = (projectId: string, mrId: string) =>
  `/projects/${projectId}/merge_requests/${mrId}`;

const getRandomApprover = (
  approvers: Approver[],
  nbApprover: number
): number[] => {
  if (!approvers.length || nbApprover <= 0) {
    return [];
  }

  const rdIndex = Math.floor(Math.random() * approvers.length);

  return [
    approvers[rdIndex].id,
    ...getRandomApprover([...approvers].splice(rdIndex, 1), nbApprover - 1),
  ];
};

export const getMrApprovalRules = (
  projectId: string,
  mrId: string,
  callback: (body?: ApprovalRule[]) => void
) => {
  get(getMrApprovalRulesPath(projectId, mrId), callback);
};

export const getEligibleApproversFromRules = (rules: ApprovalRule[]) =>
  rules.reduce((acc: number[], { approvals_required, eligible_approvers }) => {
    let selectedApprover = [];

    if (approvals_required) {
      selectedApprover = getRandomApprover(
        eligible_approvers,
        approvals_required
      );
    }

    return [...acc, ...selectedApprover];
  }, []); // TODO: filter to avoid duplication of element
