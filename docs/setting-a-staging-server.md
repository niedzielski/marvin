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
* Under **Flavor**, choose an appropiate size depending on your group's capacity
  and who is going to use the server.
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

## 2. Set up the server

```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install nodejs
```

Verify node is properly installed, `nodejs -v` should output something like
`v6.11.0`.

Verify your server is accesible from the web browser by running a dummy http
server (instead of 8080 use the port you specified when creating the web proxy):

```
$ nodejs -e "require('http').createServer((req, res) => res.end('hello world marvin')).listen(8080)"
```

Open your browser and go to your web proxy url (ex: `marvin.wmflabs.org`), and
you should see in your browser:

```
hello world marvin
```

If so, you have a VM where you can run a server, and it can be accessible from
web browser clients, so we are ready to go!
