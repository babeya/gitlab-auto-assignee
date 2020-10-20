# gitlab-auto-assignee

Auto assign randomly a user to a merge request

![Node.js CI](https://github.com/babeya/gitlab-auto-assignee/workflows/Node.js%20CI/badge.svg)

## Getting started

### 1 - Clone the repository on your gitlab server

```bash
  git clone git@github.com:babeya/gitlab-auto-assignee.git
```

### 2 - Install dependencies

```bash
  yarn install
```

### 3 - Update config

Copy and fill config files :

```bash
cp rules.ts.dist rules.ts && cp config.ts.dist config.ts
```

### 4 - Edit hook configuration

Open the previously created config.ts and fill the missing information.

```typescript
const config = {
  // uri of your gitlab : https://my-gitlab.com
  gitlabUrl: "",
  // Token of the gitlab user associated to the hook. Checkout https://docs.gitlab.com/ee/api/#impersonation-tokens for more informations
  token: "",
  // id of the gitalb user
  userId: 0
  // Enable logging of error and actions done by the script in a file
  debug: false,
  // Path to the log file
  debugOuput: "/tmp/debugOutput.txt",
};
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

### 6 - Bundle an excutable

```bash
yarn build
```

### 7 - Copy the hook inside the gitlab folder

Dependending of your installation you need to copy the file previously compiled (/bin/auto-assignee) in the gitlab filehook folder.

- Installation from source

```bash
  sudo cp ./bin/auto-assignee /home/git/gitlab/filehook/
```

- Omnibus install

```bash
  sudo cp ./bin/auto-assignee /opt/gitlab/embedded/service/gitlab-rails/file_hooks
```
