import {NodeProperties, Red} from 'node-red';
import GithubInterface from './Github';

module.exports = function(RED: Red) {
  'use strict';

  function GithubNode(n: NodeProperties) {
    // @ts-ignore
    const node: any = this;
    RED.nodes.createNode(node, n);
    node.name = n.name;
  }
  RED.nodes.registerType('github-credentials', GithubNode, {
    credentials: {
      token: {type: 'password'}
    }
  });

  // @ts-ignore
  function GithubRepo(n) {
    // @ts-ignore
    const node: any = this;

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
    const github = new (require('github-api'))({
    // @ts-ignore
      token: RED.nodes.getNode(n.github).credentials.token,
      auth: 'oauth'
    });
    node.status({});
    node.on('input', function(msg: { payload: object }) {
      node.status({fill: 'blue', shape: 'ring', text: node.action});
      const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
      const repository_f = RED.util.evaluateNodeProperty(node.repository, node.repositoryType, node, msg);
      const repo = github.getRepo(username_f, repository_f);

      function callbackErrData(err: Error, data: object) {
        if(err) {
          node.status({fill: 'red', shape: 'dot', text: 'Error: ' + node.action});
          node.error(err);
        } else {
          msg.payload = data;
          node.status({});
          node.send(msg);
        }
      }

      function callbackErr(err: Error) {
        if(err) {
          node.status({fill: 'red', shape: 'dot', text: 'Error' + node.action});
          node.error(err);
        } else {
          node.status({});
        }
      }

      if(node.action === 'show') {
        repo.show(callbackErrData);
      } else if(node.action === 'fork') {
        repo.fork(callbackErr);
      } else if(node.action === 'contributors') {
        repo.contributors(callbackErrData);
      } else if(node.action === 'listforks') {
        repo.listForks(callbackErrData);
      } else if(node.action === 'listbraches') {
        repo.listBranches(callbackErrData);
      } else if(node.action === 'delete') {
        repo.deleteRepo(callbackErrData);
      } else if(node.action === 'contents') {
        const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
        const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
        repo.contents(branch_f, path_f, callbackErrData);
      } else if(node.action === 'read') {
        const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
        const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
        repo.read(branch_f, path_f, callbackErrData);
      } else if(node.action === 'write') {
        const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
        const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
        const contents_f = RED.util.evaluateNodeProperty(node.contents, node.contentsType, node, msg);
        const options = {};
        repo.write(branch_f, path_f, contents_f, 'Add ' + path_f, options, callbackErr);
      } else if(node.action === 'move') {
        const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
        const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
        const pathto_f = RED.util.evaluateNodeProperty(node.pathto, node.pathtoType, node, msg);
        repo.move(branch_f, path_f, pathto_f, callbackErr);
      } else if(node.action === 'remove') {
        const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
        const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
        repo.remove(branch_f, path_f, callbackErr);
      }
    });
  }
  RED.nodes.registerType('github-repo', GithubRepo);

  function GithubUser(n: any) {
    // @ts-ignore
    const node = this;
    RED.nodes.createNode(node, n);

    node.action = n.action;
    node.options = n.options;
    node.optionsType = n.optionsType;
    node.username = n.username;
    node.usernameType = n.usernameType;
    node.orgname = n.orgname;
    node.orgnameType = n.orgnameType;

    const github = new (require('github-api'))({
      // @ts-ignore
      token: RED.nodes.getNode(n.github).credentials.token,
      auth: 'oauth'
    });
    const user = github.getUser();

    // node.status({});
    // const github = new GithubInterface();

    node.on('input', function(msg: { payload: object }) {
      function callbackErrData(err: Error, data: object) {
        if(err) {
          node.error(err);
        } else {
          msg.payload = data;
          node.send(msg);
        }
      }

      if(node.action === 'repos') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        user.repos(options_f, callbackErrData);
      } else if(node.action === 'orgs') {
        user.orgs(callbackErrData);
      } else if(node.action === 'gists') {
        user.gists(callbackErrData);
      } else if(node.action === 'notifications') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        user.notifications(options_f, callbackErrData);
      } else if(node.action === 'show') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.show(username_f, callbackErrData);
      } else if(node.action === 'userrepos') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.userRepos(username_f, callbackErrData);
      } else if(node.action === 'userstarred') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.userStarred(username_f, callbackErrData);
      } else if(node.action === 'createrepo') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        user.createRepo(options_f, callbackErrData);
      } else if(node.aciton === 'orgrepos') {
        const orgname_f = RED.util.evaluateNodeProperty(node.orgname, node.orgnameType, node, msg);
        user.orgRepos(orgname_f, callbackErrData);
      } else if(node.action === 'usergists') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.userGists(username_f, callbackErrData);
      }
    });
  }
  RED.nodes.registerType('github-user', GithubUser);

  function GithubMyUser(n: any) {
    // @ts-ignore
    const node = this;
    RED.nodes.createNode(node, n);

    node.action = n.action;
    node.options = n.options;
    node.optionsType = n.optionsType;
    node.username = n.username;
    node.usernameType = n.usernameType;
    node.orgname = n.orgname;
    node.orgnameType = n.orgnameType;
    // @ts-ignore
    const gi = new GithubInterface({
    // @ts-ignore
      token: RED.nodes.getNode(n.github).credentials.token,
    });

    const github = gi.getGit();
    const user = github.getUser();

    // node.status({});
    node.on('input', function(msg: { payload: object }) {
      function callbackErrData(err: Error, data: object) {
        if(err) {
          node.error(err);
        } else {
          msg.payload = data;
          node.send(msg);
        }
      }

      if(node.action === 'repos') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        user.repos(options_f, callbackErrData);
      } else if(node.action === 'orgs') {
        user.orgs(callbackErrData);
      } else if(node.action === 'gists') {
        user.gists(callbackErrData);
      } else if(node.action === 'notifications') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        user.notifications(options_f, callbackErrData);
      } else if(node.action === 'show') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.show(username_f, callbackErrData);
      } else if(node.action === 'userrepos') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.userRepos(username_f, callbackErrData);
      } else if(node.action === 'userstarred') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.userStarred(username_f, callbackErrData);
      } else if(node.action === 'createrepo') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        user.createRepo(options_f, callbackErrData);
      } else if(node.aciton === 'orgrepos') {
        const orgname_f = RED.util.evaluateNodeProperty(node.orgname, node.orgnameType, node, msg);
        user.orgRepos(orgname_f, callbackErrData);
      } else if(node.action === 'usergists') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        user.userGists(username_f, callbackErrData);
      }
    });
  }
  RED.nodes.registerType('github-myuser', GithubMyUser);
};
