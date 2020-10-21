![Node.js CI](https://github.com/babeya/gitlab-auto-assignee/workflows/Node.js%20CI/badge.svg)

# gitlab-auto-assignee

Auto assign randomly a user to a merge request

## 1 Requirements

To work properly, gitlab-auto-assignee need some environements variables to be setup. You can find the list below:

| Name             | Req.               | Ini. Val.          | Description                                                                                                                                                                             |
| ---------------- | ------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GAA_API_TOKEN    | :heavy_check_mark: |                    | Token used by the hook to access the api, it needs api rights. Also, the user associated to the token need to have correct access to repository and groups which it will interact with. |
| GAA_USER_ID      | :heavy_check_mark: |                    | User id of the user associated to GAA_API_TOKEN. We need it to avoid assigning the user to a merge-request.                                                                             |
| GAA_SECRET_TOKEN | :heavy_check_mark: |                    | [Secret token](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#secret-token) used to authenticate requests.                                                          |
| GAA_RULES_URL    | :heavy_check_mark: |                    | Url of your configuration file. A Get request is done on that url for each merge-request. To learn more about the configuration file check [section 2](#config-file).                   |
| GAA_API_URL      |                    | https://gitlab.com | Gitlab url.                                                                                                                                                                             |
| GAA_PORT         |                    | 3000               | Port used by the hook.                                                                                                                                                                  |

## 2 Installation

First of all, you have to configure a webhook on repositories on which you want gitlab-auto-assignee to work on.

The webhook url is `$yourUrl/mr`, where \$yourUrl is the url on which you will deploy the app.

Check `Merge requests events` as trigger of the webhook. All other events are ignored.

You can find more informations about gitlab webhook [here](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html)

### 2.1 From sources

To build and install the hook from sources, you need to checkout the repository and build the project like a classique javascript module. Be sure to set all required environements variables in your bashrc or inline when using `yarn start`.

```bash
  git clone git@github.com:babeya/gitlab-auto-assignee.git
  yarn install
  yarn start
```

### 2.2 Docker

There is a ready to use docker image available at ghcr.io/babeya/gitlab-auto-assign:latest.

```bash
  docker run -d -p 3000:3000 --env [your environements] ghcr.io/babeya/gitlab-auto-assign:latest
```

## 3 Config file

The config files is used to define which members and how many will be assigned to new merge requests. You can use [this file](https://github.com/babeya/gitlab-auto-assignee/blob/master/rules.json) as a base for your own. If you do, you have to add projectIds and the groupId coresponding to your needs. You can host the file where you want (a git repository works great), but you have to ensure access for the hook.

Below a more complete example :

```json
{
  "projects": [
    // You can setup multiple rules on different repository with different group, just ensure the bot has access to all groups and project
    {
      "projectIds": [1], // Project ids on which subsequent rules while applies
      "groupId": 1, // Id of the group acting as a pool of user
      "rules": [
        {
          "branch": ["master"], // Target branch
          "minLevel": 40, // Minimum access level required to be assigned
          "nbReviewers": 2 // Number of user to assign
        },
        {
          "branch": ["all"], // all is an alias matching all target branch
          "minLevel": 30,
          "nbReviewers": 2
        }
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
}
```

## Appendices

### Gitlab Access level

To learn more about gitlab access levels you can check this [page](https://docs.gitlab.com/ee/user/permissions.html).

Below a simple cheat sheet summing it up:

- 50 -> Owner
- 40 -> Maintainer
- 30 -> Developer
- 20 -> Reporter
- 10 -> Guest
