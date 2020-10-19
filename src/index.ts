const fs = require('fs');
const express = require('express');
const bodyparser = require('body-parser');

// TODO: env
const port = 3000;

import config from '../config';

import {
  setMergeRequestAssignee,
  getGroupMembers,
  //isEventAnMrOpening,
} from './gitlab';

import { applyRules, getRulesForMr } from './rules';
import debug from './debug';

const app = express();

app.use(bodyparser.json());

app.post('/mr', (req, res) => {
  console.log('helloow');
  const gitLabEvent = req.body;

  const project_id = gitLabEvent.project.id;
  const mrIid = gitLabEvent.object_attributes.iid;
  const target_branch = gitLabEvent.object_attributes.target_branch;

  const rules = getRulesForMr({ project_id, target_branch });

  console.log(rules);

  if (!rules) {
    process.exit();
  }

  getGroupMembers({ groupId: rules.groupId }, (body) => {
    console.log(body);

    if (!body || !body.length) {
      return;
    }

    const members = applyRules(
      rules.rules,
      body.filter(({ id }) => {
        id !== config.userId;
      })
    );

    console.log(members);

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

/*

  
} catch (error) {
  debug(error.message || error.toString());
}
*/
