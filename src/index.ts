const fs = require("fs");

import {
  getMrApprovalRules,
  getEligibleApproversFromRules,
  setMergeRequestAsignee,
} from "./gitlab";

// 1 - Get and parse the event
const stdinBuffer = fs.readFileSync(0);
const gitLabEvent = JSON.parse(stdinBuffer);

const MR_EVENT = ["merge_request"];
const MR_OPEN_ACTION = "open";

// 4 - Get MergeRequest reviewer
// 5 - Find and select them ramdomly
// 6 - Assign merge request

// 2 - If it's not a new mergeRequest - Exit
if (
  !MR_EVENT.includes(gitLabEvent.event_type) &&
  gitLabEvent.object_attributes.action !== MR_OPEN_ACTION
) {
  process.exit();
}

var projectId = gitLabEvent.project.id;
var mrIid = gitLabEvent.object_attributes.iid;

// 3 - Check if the repos has a tag enabling auto assignment
getMrApprovalRules({ projectId, mrIid }, (body) => {
  if (!body || !body.length) {
    return;
  }

  const approvers = getEligibleApproversFromRules(body);

  if (approvers && approvers.length) {
    setMergeRequestAsignee(
      { projectId, mrIid, assignees: approvers },
      () => {}
    );
  }
});
