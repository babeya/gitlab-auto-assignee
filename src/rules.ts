import RulesConfig from "../rules";

type MergeRequest = {
  target_branch: string;
  project_id: number;
};

type ProjectConfig = {
  projectId: number;
  rules: Rule[];
};

type Rule = {
  branch: string | "All";
  groupId: number;
  minLevel: number; // TODO use access level
  nbReviewers: number;
};

const ALL_BRANCH_ALIAS = "All";

export const getRulesForMr = ({ project_id, target_branch }: MergeRequest): Rule[] => {
  // Check if the project is supported
  const { projects } = RulesConfig;

  const projectRules = projects.find(
    ({ projectId }: ProjectConfig) => project_id === projectId
  );

  if (!projectRules) {
    return [];
  }

  // Find rules matching the target branch
  return projectRules.rules.filter(
    ({ targetBranch }) =>
      targetBranch === ALL_BRANCH_ALIAS || targetBranch === target_branch
  );
};
