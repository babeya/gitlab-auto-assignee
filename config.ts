const config = {
  // uri of your gitlab : https://my-gitlab.com
  gitlabUrl: "",
  // Token of the gitlab user associated to the hook. Checkout https://docs.gitlab.com/ee/api/#impersonation-tokens for more informations
  token: "",
  // id of the gitlab user associated to the hook. Used to avoid assigning itself to merge request 
  botId: 0,
  // Enable logging of error and actions done by the script in a file
  debug: false,
  // Path to the log file
  debugOuput: "/tmp/debugOutput.txt",
  // id of the group of dev to asign to merge request
  groupId: 3,
};

export default config;
