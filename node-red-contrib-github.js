"use strict";
exports.__esModule = true;
var GithubMyUser = require("./lib/self");
var GithubRepo = require("./lib/repo");
var GithubUser = require("./lib/user");
module.exports = function (RED) {
    function GithubNode(n) {
        // @ts-ignore
        var node = this;
        RED.nodes.createNode(node, n);
        node.name = n.name;
    }
    RED.nodes.registerType('github-credentials', GithubNode, {
        credentials: {
            token: { type: 'password' },
            password: { type: 'password' }
        }
    });
    // @ts-ignore
    RED.nodes.registerType('github-repo', GithubRepo);
    // @ts-ignore
    RED.nodes.registerType('github-user', GithubUser);
    // @ts-ignore
    RED.nodes.registerType('github-myuser', GithubMyUser);
};
