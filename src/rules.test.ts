import { getRulesForMr, applyRules } from './rules';
import { RulesConfig, Member } from './types';

const baseProjectId = 1;
const baseGroupId = 2;
const baseBranch = 'master';
const baseRules: RulesConfig = {
  projects: [
    {
      projectIds: [baseProjectId],
      groupId: baseGroupId,
      rules: [
        { branch: ['All'], minLevel: 20, nbReviewers: 2 },
        { branch: ['master'], minLevel: 20, nbReviewers: 2 },
      ],
    },
  ],
};

describe('getRulesForMr', () => {
  it('return null if there is no rules for the mr', () => {
    expect(
      getRulesForMr({ project_id: 10, target_branch: baseBranch }, baseRules)
    ).toEqual(null);
  });

  it('return all rules matching the branch and the project id', () => {
    const rule = getRulesForMr(
      { project_id: baseProjectId, target_branch: 'master' },
      baseRules
    );
    expect(rule.groupId).toEqual(baseGroupId);
    expect(rule.rules.length).toEqual(baseRules.projects[0].rules.length);
  });
});

describe('applyRules', () => {
  const baseMembers: Member[] = [
    { id: 1, access_level: 50 },
    { id: 2, access_level: 40 },
    { id: 3, access_level: 30 },
    { id: 4, access_level: 20 },
    { id: 5, access_level: 10 },
    { id: 6, access_level: 30 },
    { id: 7, access_level: 30 },
    { id: 8, access_level: 30 },
  ];

  it('return a set of random members from the members list according to the rules', () => {
    expect(applyRules(baseRules.projects[0].rules, baseMembers).length).toEqual(
      4
    );
  });

  it('return as much members as possible if there is not enough members matching rules', () => {
    expect(
      applyRules(baseRules.projects[0].rules, baseMembers.slice(0, 1)).length
    ).toEqual(1);
  });
});
