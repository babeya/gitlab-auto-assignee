![Node.js CI](https://github.com/babeya/gitlab-auto-assignee/workflows/Node.js%20CI/badge.svg)

# gitlab-auto-assignee

Auto assign randomly a user to a merge request

## Requirements

To work properly, gitlab-auto-assignee need some environements variables to be setup. You can find the list below:

| Name             | Req.               | Ini. Val.          | Description                                                                                                                                                                                |
| ---------------- | ------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GAA_API_TOKEN    | :heavy_check_mark: |                    | Token used by the hook to access the api, it needs api rights. Also, the user associated to the token need to have correct access to repository and groups which it will be interact with. |
| GAA_USER_ID      | :heavy_check_mark: |                    | User id of the user associated to GAA_API_TOKEN. We need it to avoid assigning the user to a merge-request                                                                                 |
| GAA_SECRET_TOKEN | :heavy_check_mark: |                    | [Secret token](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#secret-token) used to authenticate requests.                                                             |
| GAA_RULES_URL    | :heavy_check_mark: |                    | Url of your configuration file. A Get request is done on that url for each merge-request. To learn more about the configuration file check [section 2](##config-file).                     |
| GAA_API_URL      |                    | https://gitlab.com | Gitlab url                                                                                                                                                                                 |
| GAA_PORT         |                    | 3000               | Port used by the hook url                                                                                                                                                                  |

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

## Config file

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
