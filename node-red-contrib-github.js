"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var git_api_wrapper_1 = require("./lib/git-api-wrapper/");
var user = require("./lib/user");
// module.exports = function(RED: Red) {
module.exports = function (RED) {
    'use strict';
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
    function GithubRepo(n) {
        // @ts-ignore
        var node = this;
        RED.nodes.createNode(node, n);
        node.github = n.github;
        node.username = n.username;
        node.usernameType = n.usernameType;
        node.repository = n.repository;
        node.repositoryType = n.repositoryType;
        node.action = n.action;
        node.branch = n.branch;
        node.branchType = n.branchType;
        node.path = n.path;
        node.pathType = n.pathType;
        node.contents = n.contents;
        node.contentsType = n.contentsType;
        node.pathto = n.pathto;
        node.pathtoType = n.pathtoType;
        // @ts-ignore
        var IGithub = new git_api_wrapper_1.GitApiWrapper({
            // @ts-ignore
            token: RED.nodes.getNode(n.github).credentials.token
        });
        // @ts-ignore
        var github = IGithub.gh;
        node.status({});
        node.on('input', function (msg) {
            node.status({ fill: 'blue', shape: 'ring', text: node.action });
            var username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
            var repository_f = RED.util.evaluateNodeProperty(node.repository, node.repositoryType, node, msg);
            var repo = github.getRepo(username_f, repository_f);
            if (node.action === 'show') {
                node.log('show');
                node.status({ fill: 'green', shape: 'ring' });
            }
        });
    }
    RED.nodes.registerType('github-repo', GithubRepo);
    function GithubUser(n) {
        // @ts-ignore
        var node = this;
        RED.nodes.createNode(node, n);
        node.action = n.action;
        node.options = n.options;
        node.optionsType = n.optionsType;
        node.username = n.username;
        node.usernameType = n.usernameType;
        node.orgname = n.orgname;
        node.orgnameType = n.orgnameType;
        // @ts-ignore
        var IGithub = new git_api_wrapper_1.GitApiWrapper({
            // @ts-ignore
            token: RED.nodes.getNode(n.github).credentials.token
        });
        node.on('input', function (msg) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // @ts-ignore
                    user.processUserNode(node, RED, msg, IGithub);
                    return [2 /*return*/];
                });
            });
        });
    }
    RED.nodes.registerType('github-user', GithubUser);
    function GithubMyUser(n) {
        // @ts-ignore
        var node = this;
        RED.nodes.createNode(node, n);
    }
    RED.nodes.registerType('github-myuser', GithubMyUser);
};
