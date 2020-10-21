const config = {
  gitlabUrl: process.env.GAA_API_URL || 'https://gitlab.com',
  token: process.env.GAA_API_TOKEN,
  userId: process.env.GAA_USER_ID,
  rulesFileUrl: process.env.GAA_RULES_URL,
  port: process.env.GAA_PORT || 3000,
  verifyToken: process.env.GAA_SECRET_TOKEN,
};

export default config;
