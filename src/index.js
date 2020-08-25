#!/usr/bin/env node




// 4 - Get MergeRequest reviewer
// 5 - Find and select them ramdomly 
// 6 - Assign merge request 

var fs = require("fs");
var http = require('http');
var exit = require("process");

// 1 - Get and parse the event 
var stdinBuffer = fs.readFileSync(0);
var event = JSON.parse(stdinBuffer);


var MR_EVENT = ['merge_request'];
var API_URL = 'http://localhost/api/'

function get(url, callback) {
  http.get(url, (resp) => {
    var data = ''

    resp.on('data', (chunk) => {
        data += chunk
    })
  
    resp.on('end', () => {
        callback(data);
    })
  
    // TODO: error
  });
}


function getApprovalRule(projectId, callback) {
  get(API_URL + 'projects/' + projectId  + '/approval_rules', function (data) {    
    fs.writeFileSync('/tmp/toto.txt', data);
    callback && callback(data)
  })
}


var projectId = event.project.id;
var mrId = event.object_attributes.iid;

// 2 - If it's not a new mergeRequest - Exit 
if (!MR_EVENT.includes(event.event_type)) {
  process.exit();
}

// 3 - Check if the repos has a tag enabling auto assignment 
getApprovalRule(projectId);

setTimeout(() => {

}, 1000)




