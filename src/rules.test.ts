import { getRulesForMr } from './rules';
import { RulesConfig } from './types';

describe('getRulesForMr', () => {
  const baseRules: RulesConfig = {
    projects: [
      {
        projectIds: [1],
        groupId: 2,
        rules: [{ branch: ['All'], minLevel: 20, nbReviewers: 2 }],
      },
    ],
  };

  it('return null if there is no rules for the mr', () => {
    expect(
      getRulesForMr({ project_id: 10, target_branch: 'master' }, baseRules)
    );
  });
});
