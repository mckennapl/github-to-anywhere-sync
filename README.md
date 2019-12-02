# Github to Anywhere Sync
A node.js webserver that will sync Github to any other remote version control repo. This was initially created to sync Github to BitBucket.

The webserver will listen for incoming Github webhooks, fetch and get all, and then push everything to your remote repo, effectively creating a realtime sync between repos.

A lot of this was pulled from [this very handy Digital Ocean guide](https://www.digitalocean.com/community/tutorials/how-to-use-node-js-and-github-webhooks-to-keep-remote-projects-in-sync), I only expounded on a few elements.

## Usage
I run this on a nano ec2 instance as a systemd service. For example if you want to run the webserver as `user` on port `8080`, and your webserver is named `webhook.js` and in `user` home directory:

``` bash
[Unit]
Description=Github webhook
After=network.target

[Service]
Environment=NODE_PORT=8080
Type=simple
User=user
ExecStart=/usr/bin/nodejs /home/user/NodeWebhooks/webhook.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

If there are multiple repos, create multiple services running on incremented ports.

Follow [this gist](https://gist.github.com/derick-montague/534572db76b30d9d9fd97c10b7aaf61d) to create your sync and origin remotes. I'll add it here for posterity:

### Set up remotes
**setup local repo**
```git
mkdir myrepository
cd myrepository
git init
```

**add  bitbucket remote as "origin"**
```git
git remote add origin ssh://git@bitbucket.org/aleemb/myrepository.git
```
**add github remote as "sync"**
```git
git remote add sync https://github.com/aleemb/laravel.git
```
**verify remotes**
```git
git remote -v
**should show fetch/push for "origin" and "sync" remotes**
```

### Set up Branches
**first pull from github using the "sync" remote**
```git
git pull sync
```

**setup local "github" branch to track "sync" remote's "master" branch**
```git
git branch --track github sync/master
```

**switch to the new branch**
```git
git checkout github
```

**create new master branched out of github branch**
```git
git checkout -b master
```

**push local "master" branch to "origin" remote (bitbucket)**
```git
git push -u origin master
```

https://stackoverflow.com/questions/8137997/forking-from-github-to-bitbucket

## Notes
I am more than open to PRs and improvements.
