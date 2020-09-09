const fs = require("fs");

import config from "../config";

import {
  setMergeRequestAssignee,
  getGroupMembers,
  getRandomMembers,
  isEventAnMrOpening,
} from "./gitlab";

import { applyRules, getRulesForMr } from "./rules";
import debug from "./debug";

try {
  // 1 - Get and parse the event
  const stdinBuffer = fs.readFileSync(0);
  const gitLabEvent = JSON.parse(stdinBuffer);

  // 4 - Get MergeRequest reviewer
  // 5 - Find and select them ramdomly
  // 6 - Assign merge request

  // 2 - If it's not a new mergeRequest - Exit
  if (!isEventAnMrOpening(gitLabEvent)) {
    process.exit();
  }

  // TODO: clean
  const project_id = gitLabEvent.project.id;
  const mrIid = gitLabEvent.object_attributes.iid;
  const target_branch = gitLabEvent.object_attributes.target_branch;

  // TODO: rename 
  const rules = getRulesForMr({ project_id, target_branch });

  // 3 - Check if the repos has a tag enabling auto assignment
  getGroupMembers({ groupId: rules.groupId }, (body) => {
    if (!body || !body.length) {
      return;
    }

    // Filter out our user from the members to avoid assigning him
    const members = applyRules(
      rules.rules,
      body.filter(({ id }) => {
        id !== config.botId;
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
