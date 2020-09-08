const fs = require("fs");

import config from "../config";

import {
  setMergeRequestAssignee,
  getGroupMembers,
  getRandomMembers,
  isEventAnMrOpening,
} from "./gitlab";

import { applyRules } from "./rules";

console.log(applyRules(
  [
    { branch: ["all"], minLevel: 30, nbReviewers: 2 },
    { branch: ["master"], minLevel: 40, nbReviewers: 2 },
  ],
  [
    {
      id: 1,
      access_level: 10,
    },
    {
      id: 2,
      access_level: 30,
    },
    {
      id: 4,
      access_level: 30,
    },
    {
      id: 5,
      access_level: 30,
    },
    {
      id: 6,
      access_level: 30,
    },
    {
      id: 7,
      access_level: 40,
    },
    {
      id: 7,
      access_level: 40,
    },
    {
      id: 8,
      access_level: 40,
    },
    {
      id: 9,
      access_level: 40,
    },
    {
      id: 10,
      access_level: 10,
    },
    {
      id: 11,
      access_level: 10,
    },
    {
      id: 12,
      access_level: 40,
    },
    {
      id: 13,
      access_level: 50,
    },
    {
      id: 15,
      access_level: 50,
    },
  ]
));

/*
// 1 - Get and parse the event
const stdinBuffer = fs.readFileSync(0);
const gitLabEvent = JSON.parse(stdinBuffer);

// 4 - Get MergeRequest reviewer
// 5 - Find and select them ramdomly
// 6 - Assign merge request

// 2 - If it's not a new mergeRequest - Exit
if (isEventAnMrOpening) {
  process.exit();
}

var projectId = gitLabEvent.project.id;
var mrIid = gitLabEvent.object_attributes.iid;

// 3 - Check if the repos has a tag enabling auto assignment
getGroupMembers({ groupId: config.groupId }, (body) => {
  if (!body || !body.length) {
    return;
  }

  const members = getRandomMembers(body, 30);

  if (members && members.length) {
    setMergeRequestAssignee(
      { projectId, mrIid, assignees: members.map(({ id }) => id) },
      () => {}
    );
  }
});
*/
