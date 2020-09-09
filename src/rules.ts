import RulesConfig from "../rules";
import { Member, AccessLevel } from "./gitlab/types";
import { getRandomMembers } from "./gitlab";

type MergeRequest = {
  target_branch: string;
  project_id: number;
};

type ProjectConfig = {
  projectIds: number[];
  rules: Rule[];
  groupId: number;
};

type Rule = {
  branch: (string | "All")[];
  minLevel: AccessLevel; // TODO use access level
  nbReviewers: number;
};

const ALL_BRANCH_ALIAS = "All";

export const getRulesForMr = ({
  project_id,
  target_branch,
}: MergeRequest): ProjectConfig => {
  // @ts-ignore
  const projects: ProjectConfig[] = RulesConfig.projects;

  const projectRules = projects.find(({ projectIds }: ProjectConfig) =>
    projectIds.includes(project_id)
  );

  if (!projectRules) {
    return null;
  }

  // Find rules matching the target branch
  return {
    ...projectRules,
    rules:  projectRules.rules.filter(
      ({ branch }: Rule) =>
        branch.includes(ALL_BRANCH_ALIAS) || branch.includes(target_branch)
    )
  }
};

const applyRule = (
  { minLevel, nbReviewers }: Rule,
  members: Member[]
): [Member[], Member[]] => {
  let membersLeft = [...members];
  const selectedMembers = getRandomMembers(members, minLevel, nbReviewers);

  selectedMembers.forEach((selectedMember) => {
    const indexToRemove = membersLeft.indexOf(selectedMember);
    if (indexToRemove !== -1) {
      membersLeft = membersLeft.splice(indexToRemove, 1);
    }
  });
  console.log(selectedMembers);

  return [selectedMembers, members];
};

export const applyRules = (rules: Rule[], members: Member[]): Member[] => {
  let memberAcc = [...members];

  rules.sort((a, b) => a.minLevel - b.minLevel);

  return rules.reduce((acc, rule) => {
    const [newSelectedMembers, membersLeft] = applyRule(rule, memberAcc);
    memberAcc = membersLeft;

    return acc.concat(newSelectedMembers);
  }, []);
};
