# Setting a staging server

In this guide, you can see instructions for setting up a staging server for
Marvin.

Some instructions are specific to Wikimedia environments, but many are generally
applicable.

## 1. Get a VM (Wikimedia CloudVPS instructions)

Pre-requisites:

* Have access to wikitech.wikimedia.org, and horizon.wikimedia.org.
* Be a member of a group and be able to launch new instances.

### VM setup

Go to <https://horizon.wikimedia.org/project/instances/> and in your preferred
group launch a new instance.

* Fill up the details (name)
* Under **Source**, choose a debian based image. Debian 8.9-jessie at the time
  of writing this is the recommended one with included node source repositories.
* Under **Flavor**, choose an appropriate size depending on your group's
  capacity and who is going to use the server.
* Under **Security Groups**, add the **web** group so that web ports on the VM
  are exposed.
* Click on **Launch Instance** and wait!
* Verify you can ssh into the machine

### Setup DNS

Go to <https://horizon.wikimedia.org/project/proxy/> and:

* Click **+ Create proxy** to get a new web proxy address (which will forward
  requests to your backend and provide SSL termination).
* Fill up the **Hostname**, which will be the subdomain name you get.
* Select for **Backend instance** the server you just created.
* Specify a **Backend port**, which is to which port in your VM the requests to
  the url will be forwarded.
* Click **Create proxy**

## 2. Check server and initial setup

```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install nodejs
```

Verify node is properly installed, `nodejs -v` should output something like
`v6.11.0`.

Alias `nodejs` as `node` so that we can upgrade npm later by doing:

```
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

Verify your server is accesible from the web browser by running a dummy http
server (instead of 8080 use the port you specified when creating the web proxy):

```
$ node -e "require('http').createServer((req, res) => res.end('hello world marvin')).listen(8080)"
```

Open your browser and go to your web proxy url (ex:
https://marvin.wmflabs.org/), and you should see in your browser:

```
hello world marvin
```

If so, you have a VM where you can run a server, and it can be accessible from
web browser clients, so we are ready to go!

Remember to kill the server before you do anything else (`killall node`)

## 3. Install dependencies for building the app

Install npm:

```
$ sudo apt-get install npm
$ npm -v
1.4.21
```

We need npm 5 to reproducibly install and build our app in staging, so lets
upgrade npm:

```
$ sudo npm install -g npm@5
$ bash # Start a new shell so that it picks up the new npm install
$ npm -v
5.3.0
```

## 4. Setting up the repository and running the server

First, let's create a user which will have limited privileges (no sudo for
example) and own the repository and processes:

```
$ sudo adduser marvin
# Answer the questions and set a password up
```

And switch out from your account to its account:

```
$ sudo su marvin
marvin@marvin-staging $ cd ~
```

Let's create a folder for the repository (`sources/`), and a folder for the app
tarball (`dist/`):

```
marvin@marvin-staging:~$ mkdir sources/
marvin@marvin-staging:~$ mkdir dist/
marvin@marvin-staging:~$ ls
dist  sources
```

Let's clone the repo into sources

```
marvin@marvin-staging:~$ git clone https://phabricator.wikimedia.org/source/marvin.git sources/
Cloning into 'sources'...
#...[redacted]
Checking connectivity... done.
marvin@marvin-staging:~$ ls sources/
docs  package.json  package-lock.json  readme.md  src  test  tsconfig.json  webpack.config.js
```

Create a post-merge hook in the repo so that we can build and re-run the server
on git pull:

```
marvin@marvin-staging:~$ cd sources/
marvin@marvin-staging:~/sources$ vim .git/hooks/post-merge
```

```sh
#!/bin/bash

#~/sources/.git/hooks/post-merge
set -e
set -o pipefail

echo "Running post-merge hook"

echo "Installing and building server bundle"
# Use our newer install of npm:
/usr/local/bin/npm install --no-save
/usr/local/bin/npm run build

echo "Removing previously started server processes"
killall node || true

echo "Copying new tarball"
rm -rf /home/marvin/dist
cp -R dist/ /home/marvin/dist
cp -R node_modules/ /home/marvin/dist/node_modules

echo "Running new server version"
NODE_ENV=production node /home/marvin/dist/server/index.js &
```

And make it executable

```
marvin@marvin-staging:~/sources$ chmod +x .git/hooks/post-merge
```

You can try it out by running it directly:

```
marvin@marvin-staging:~/sources$ ./.git/hooks/post-merge
Running post-merge hook
Installing and building server bundle
added 115 packages in 12.848s

> marvin@0.0.0 build /home/marvin/sources
> NODE_ENV=production npm-run-all --silent clean --parallel server:build 'client:build -- -p'

Removing previously started server processes
Copying new tarball
Running new server version
Server started on http://localhost:8080/
```

Then you should be able to access your site from the browser!

## 5. Auto updating the repository

Let's set up a cron job to auto-update the repository every 5 minutes. For that,
as the **marvin** user, run `crontab -e`, and add this line at the end:

```
*/5 * * * * cd /home/marvin/sources && git pull >> /home/marvin/cron.log 2>&1
```

Every five minutes, a git pull will be done in the repo, and the log will be
written in `/home/marvin/cron.log`.

After you save, wait for 5 minutes and check the log file, you should see a log
of the cron run, like this:

```
Already up-to-date.
```

Everything should be ready to go.

## Notes and caveats

This is a raw setup, so if any exceptions rise from your node server, the
process will die, and the service won't be available. Same will happen if the
server is rebooted.

Right now we're not saving the logs anywhere so it may be difficult to debug if
a problem comes up.

We may improve this setup later by using some process runner like pm2 or
forever, and when we do so we will update this guide.

If you have to restart the process, you can use the git hook to restart it:

```
$ sudo su marvin
marvin@marvin-staging:~$ cd ~/sources
marvin@marvin-staging:~/sources$ ./.git/hooks/post-merge
```

That will trigger a full re-install, re-build, and launch the process back up
again.