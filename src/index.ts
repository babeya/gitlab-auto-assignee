const express = require('express');
const bodyparser = require('body-parser');

import config from './config';

import {
  GITLAB_TOKEN_HEADER_FIELD,
  setMergeRequestAssignee,
  getGroupMembers,
  verifyGitlabToken,
  isEventAnMrOpening,
} from './gitlab';

import { applyRules, getRulesForMr, getRulesFile } from './rules';

const app = express();

app.use(bodyparser.json());

app.post('/mr', async (req, res) => {
  try {
    res.json('ok');

    if (!verifyGitlabToken(req.header(GITLAB_TOKEN_HEADER_FIELD))) {
      return;
    }

    const gitLabEvent = req.body;

    if (!isEventAnMrOpening(gitLabEvent)) {
      return;
    }

    const project_id = gitLabEvent.project.id;
    const mrIid = gitLabEvent.object_attributes.iid;
    const authorId = gitLabEvent.object_attributes.author_id;

    const target_branch = gitLabEvent.object_attributes.target_branch;

    const rulesConfig = await getRulesFile(config.rulesFileUrl);

    const projectConfig = getRulesForMr(
      { project_id, target_branch },
      rulesConfig
    );

    if (!projectConfig?.rules?.length) {
      return;
    }

    const members = await getGroupMembers({ groupId: projectConfig.groupId });

    if (!members || !members.length) {
      return;
    }

    const selectedMembers = applyRules(
      projectConfig.rules,
      // Filters members to avoid asignating the bot user or the author
      members.filter(
        ({ id }) => id !== Number(config.userId) && id !== authorId
      )
    );

    if (selectedMembers && selectedMembers.length) {
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
