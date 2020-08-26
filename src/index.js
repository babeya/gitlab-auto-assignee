#!/usr/bin/env node

// 4 - Get MergeRequest reviewer
// 5 - Find and select them ramdomly
// 6 - Assign merge request

var fs = require("fs");
var http = require("http");
var exit = require("process");

// 1 - Get and parse the event
var stdinBuffer = fs.readFileSync(0);
var event = JSON.parse(stdinBuffer);

var TOKEN = "Xzd4VGHD5Mye5EdW3mgZ";
var MR_EVENT = ["merge_request"];
var API_URL = "http://localhost/api/";

function get(url, callback) {
  http.get(url, (resp) => {
    var data = "";

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      callback(data);
    });

    // TODO: error
  });
}

function put({ hostname, path, body, port }, callback) {
  var dataString = JSON.stringify(body);

  var result = "";

  var options = {
    hostname,
    port,
    path,
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": dataString.length,
    },
  };

  const req = http.request(options, (resp) => {
    resp.on("data", (chunk) => {
      result += chunk;
    });

    resp.on("end", () => {
      callback(data);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(post_data);
  req.end();
}

function getApprovalRule(projectId, mrIid, callback) {
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

function setMergeRequestAsignee(projectId, mrIid, callback) {
  put(
    {
      hostname: "10.0.2.15",
      port: "80",
      path: "/api/v4/" + "projects/" + projectId + "/merge_requests/" + mrIid,
    },
    callback
  );
}

// 2 - If it's not a new mergeRequest - Exit
if (!MR_EVENT.includes(event.event_type)) {
  process.exit();
}

var projectId = event.project.id;
var mrIid = event.object_attributes.iid;

// 3 - Check if the repos has a tag enabling auto assignment
getApprovalRule(projectId, mrIid);

// TODO : find a way to keep the script running
setTimeout(() => {}, 1000);
