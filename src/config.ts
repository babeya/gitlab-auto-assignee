const config = {
  // uri of your gitlab : https://my-gitlab.com
  gitlabUrl: process.env.GAA_API_URL,
  // Token of the gitlab user associated to the hook. Checkout https://docs.gitlab.com/ee/api/#impersonation-tokens for more informations
  token: process.env.GAA_API_TOKEN,
  // id of the gitalb user
  userId: process.env.GAA_USER_ID,
  rulesFileUrl: process.env.GAA_RULES_URL,
  port: process.env.GAA_PORT,
};

export default config;
