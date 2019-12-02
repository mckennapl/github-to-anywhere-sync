const secret = "your_secret_here"; // repo webhook secret
const pull_repo = "~/path/to/repo"; // repo directory on instance
const push_repo = "remote_name"; // repo directory to push to

const http = require('http'); //used to create webserver
const crypto = require('crypto'); // used to hash secret
const exec = require('child_process').exec; // used to execute shell commands

http.createServer(function (req, res) {
    req.on('data', function(chunk) {
        let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] == sig) {
            exec('cd ' + pull_repo + ' && git fetch --all && git pull --all && git push ' + push_repo + ' refs/remotes/origin/*:refs/heads/*');
        }
    });

    res.end();
}).listen(8080); // port webserver is listening on
