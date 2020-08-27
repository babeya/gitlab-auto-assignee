const fs = require("fs");

import { getMrApprovalRules, getEligibleApproversFromRules } from "./gitlab";

// 1 - Get and parse the event
const stdinBuffer = fs.readFileSync(0);
const gitLabEvent = JSON.parse(stdinBuffer);

const MR_EVENT = ["merge_request"];

// 4 - Get MergeRequest reviewer
// 5 - Find and select them ramdomly
// 6 - Assign merge request

/*
function setMergeRequestAsignee(projectId, mrIid, callback) {
  put(
    {
      hostname: "10.0.2.15",
      port: "80",
      path: "/api/v4/" + "projects/" + projectId + "/merge_requests/" + mrIid,
    },
    callback
  );
}*/

// 2 - If it's not a new mergeRequest - Exit
if (!MR_EVENT.includes(gitLabEvent.event_type)) {
  process.exit();
}

var projectId = gitLabEvent.project.id;
var mrIid = gitLabEvent.object_attributes.iid;

// 3 - Check if the repos has a tag enabling auto assignment
getMrApprovalRules(projectId, mrIid, (body: any) => {
  if (!body || !body.length) {
    return; // Error or no data -> nothing to do // TODO: Maybe add a few log for debugging
  }

  fs.writeFileSync("/tmp/toto.txt", getEligibleApproversFromRules(body));
});

// TODO : find a way to keep the script running
setTimeout(() => {}, 1000);
