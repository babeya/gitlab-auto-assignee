![Node.js CI](https://github.com/babeya/gitlab-auto-assignee/workflows/Node.js%20CI/badge.svg)

# gitlab-auto-assignee

Auto assign randomly a user to a merge request

## Requirements

To work properly, gitlab-auto-assignee need some environements variables to be setup. You can find the list below :

| Name          | Req.               | Ini. Val. | Description                                                                                                                                                                                |
| ------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GAA_API_TOKEN | :heavy_check_mark: |           | Token used by the hook to access the api, it needs api rights. Also, the user associated to the token need to have correct access to repository and groups which it will be interact with. |

```.env
  // url of the gitlab instance
  GAA_API_URL=https://gitlab.com
  // PAT with api access
  =6qMyjkyDWrUmrudRFTxL
  // User id associated with the PAT to avoid assigning him
  GAA_USER_ID=1
  // link to the rules.json file
  GAA_RULES_URL=https://gitlab.com/babeya/test-rule-autoasign/-/raw/master/rules.json
  // Port on which the hook listen
  GAA_PORT=4000
  // Verify token used with gitlab webhooks
  GAA_VERIFY_TOKEN
```

## Install

### 1 - From sources

```bash
  git clone git@github.com:babeya/gitlab-auto-assignee.git
  yarn install
  yarn start
```

### 2 - Install dependencies

```bash
  yarn install
```

### 5 - Setup rules

Open rules.ts, it's where you will setup on which repository the hook will work, which group of user will be used as a pool of potential assignee, how many of them and their minimum access level.

```typescript
"projects": [ // You can setup multiple rules on different repository with different group, just ensure the bot has access to all groups and project
  {
    "projectIds": [1], // Project ids on which subsequent rules while applies
    "groupId": 1, // Id of the group acting as a pool of user
    "rules": [
      {
        "branch": ["master"], // Target branch
        "minLevel": 40, // Minimum access level required to be assigned
        "nbReviewers": 2, // Number of user to assign
      },
      {
        "branch": ["all"], // all is an alias matching all target branch
        "minLevel": 30,
        "nbReviewers": 2
      },
    ]
  },
  {
    "projectIds": [2, 4, 5],
    "groupId": 3,
    "rules": [
      { "branch": ["dev"], "minLevel": 30, "nbReviewers": 1 },
      { "branch": ["master"], "minLevel": 40, "nbReviewers": 2 }
    ]
  }
]
```

#### 5.1 Access level

To learn more about gitlab access levels you can check this [page](https://docs.gitlab.com/ee/user/permissions.html).

- 50 -> Owner
- 40 -> Maintainer
- 30 -> Developer
- 20 -> Reporter
- 10 -> Guest
