const fs = require("fs");

import config from "../config";

import {
  setMergeRequestAssignee,
  getGroupMembers,
  isEventAnMrOpening,
} from "./gitlab";

import { applyRules, getRulesForMr } from "./rules";
import debug from "./debug";

try {
  const stdinBuffer = fs.readFileSync(0);
  const gitLabEvent = JSON.parse(stdinBuffer);

  if (!isEventAnMrOpening(gitLabEvent)) {
    process.exit();
  }

  const project_id = gitLabEvent.project.id;
  const mrIid = gitLabEvent.object_attributes.iid;
  const target_branch = gitLabEvent.object_attributes.target_branch;

  const rules = getRulesForMr({ project_id, target_branch });

  if (!rules) {
    process.exit();
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
} catch (error) {
  debug(error.message || error.toString());
}
