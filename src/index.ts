const fs = require("fs");

import { get } from "./utils";

// 1 - Get and parse the event
const stdinBuffer = fs.readFileSync(0);
const gitLabEvent = JSON.parse(stdinBuffer);

const TOKEN = "Xzd4VGHD5Mye5EdW3mgZ";
const MR_EVENT = ["merge_request"];
const API_URL = "http://localhost/api/";

// 4 - Get MergeRequest reviewer
// 5 - Find and select them ramdomly
// 6 - Assign merge request

function getApprovalRule(projectId, mrIid, callback?: any) {
  get(
    API_URL +
      "projects/" +
      projectId +
      "/merge_requests/" +
      mrIid +
      "/approval_rules?private_token=" +
      TOKEN,
    function (data) {
      fs.writeFileSync("/tmp/toto.txt", data);
      callback && callback(data);
    }
  );
}

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
getApprovalRule(projectId, mrIid);

// TODO : find a way to keep the script running
setTimeout(() => {}, 1000);
