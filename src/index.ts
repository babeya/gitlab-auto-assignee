const express = require('express');
const bodyparser = require('body-parser');

import config from './config';

import {
  setMergeRequestAssignee,
  getGroupMembers,
  isEventAnMrOpening,
} from './gitlab';

import { applyRules, getRulesForMr, getRulesFile } from './rules';

const app = express();

app.use(bodyparser.json());

app.post('/mr', async (req, res) => {
  try {
    res.json('ok');

    const gitLabEvent = req.body;

    if (!isEventAnMrOpening(gitLabEvent)) {
      return;
    }

    const project_id = gitLabEvent.project.id;
    const mrIid = gitLabEvent.object_attributes.iid;
    const target_branch = gitLabEvent.object_attributes.target_branch;

    const rulesConfig = await getRulesFile(config.rulesFileUrl);

    const rules = getRulesForMr({ project_id, target_branch }, rulesConfig);

    if (!rules) {
      return;
    }

    const members = await getGroupMembers({ groupId: rules.groupId });

    if (!members || !members.length) {
      return;
    }

    const selectedMembers = applyRules(
      rules.rules,
      members.filter(({ id }) => {
        id !== Number(config.userId);
      })
    );

    if (members && members.length) {
      setMergeRequestAssignee({
        projectId: project_id,
        mrIid,
        assignees: selectedMembers.map(({ id }) => id),
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(config.port, () => {
  console.log(
    `Gitlab autoreviewer listening at http://localhost:${config.port}`
  );
});
