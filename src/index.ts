const express = require('express');
const bodyparser = require('body-parser');

// TODO: env
const port = 3000;

import config from '../config';
import rulesConfig from '../rules';

import {
  setMergeRequestAssignee,
  getGroupMembers,
  isEventAnMrOpening,
} from './gitlab';

import { applyRules, getRulesForMr, getRulesFile } from './rules';

const app = express();

app.use(bodyparser.json());

app.post('/mr', (req, res) => {
  const gitLabEvent = req.body;

  if (!isEventAnMrOpening(gitLabEvent)) {
    res.json({ status: 'ok' });
  }

  const project_id = gitLabEvent.project.id;
  const mrIid = gitLabEvent.object_attributes.iid;
  const target_branch = gitLabEvent.object_attributes.target_branch;

  const rules = getRulesForMr({ project_id, target_branch }, rulesConfig);

  if (!rules) {
    res.json({ status: 'ok' });
  }

  getGroupMembers({ groupId: rules.groupId }, (body) => {
    if (!body || !body.length) {
      return;
    }

    const members = applyRules(
      rules.rules,
      body.filter(({ id }) => {
        id !== config.userId;
      })
    );

    if (members && members.length) {
      setMergeRequestAssignee(
        {
          projectId: project_id,
          mrIid,
          assignees: members.map(({ id }) => id),
        },
        () => {}
      );
    }
  });

  res.json('ok');
});

app.listen(port, () => {
  console.log(`Gitlab autoreviewer listening at http://localhost:${port}`);
});

getRulesFile(
  'https://gitlab.com/babeya/test-rule-autoasign/-/raw/master/rules.json'
);
