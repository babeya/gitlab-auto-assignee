import { gitlabApiGet, gitlabApiPut } from '../../utils';

import { ApprovalRule, Approver } from '../../types';

type MrPathParams = {
  projectId: number;
  mrIid: number;
};

const getMrPath = ({ projectId, mrIid }: MrPathParams) =>
  `/projects/${projectId}/merge_requests/${mrIid}`;

const getMrApprovalRulesPath = (params: MrPathParams) =>
  `${getMrPath(params)}/approval_rules`;

// TODO: remove
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

export const getMrApprovalRules = (params: MrPathParams) =>
  gitlabApiGet<ApprovalRule[]>(getMrApprovalRulesPath(params));

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
  }, []);

type SetAssigneeParams = {
  assignees: number[];
} & MrPathParams;

export const setMergeRequestAssignee = ({
  assignees,
  ...rest
}: SetAssigneeParams) =>
  gitlabApiPut(getMrPath(rest), { assignee_ids: assignees });
