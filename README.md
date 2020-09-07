# gitlab-autoreviewer

Auto asign randomly a reviewer to a merge request

## Getting started

### 1 - Clone the repository on your gitlab server

```bash
  git clone git@github.com:babeya/gitlab-autoreviewer.git
```

### 2 - Install dependencies

```bash
  yarn install
```

### 3 - Update config

Copy and fill config files :

```bash
cp rules.js.dist rules.js && cp config.js.dist config.js
```



-> gitlabUrl: url to the Gitlab api
-> Token used by the application. You need to create a user with the correct writes (he need to have full access to the api and the write access on the repository you want him to work with)

### 4 - Bundle an excutable

```bash
yarn build
```

### 5 - Copy the hook inside the gitlab folder

Dependending of your installation you need to copy the file previously compiled (/bin/autoreviewer) in the gitlab filehook folder.

* Installation from source

```bash
  sudo cp ./bin/autoreviewer /home/git/gitlab/filehook/
```

* Omnibus install

```bash
  sudo cp ./bin/autoreviewer /opt/gitlab/embedded/service/gitlab-rails/file_hooks
```
