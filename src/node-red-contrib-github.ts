import { NodeProperties, Red, Node } from 'node-red';
import { GitApiWrapper } from './lib/git-api-wrapper/';
import * as user from './lib/user';

// module.exports = function(RED: Red) {
module.exports = function(RED: any) {
  'use strict';

  function GithubNode(n: NodeProperties) {
    // @ts-ignore
    const node: Node = this;
    RED.nodes.createNode(node, n);
    node.name = n.name;
  }
  RED.nodes.registerType('github-credentials', GithubNode, {
    credentials: {
      token: {type: 'password'},
      password: {type: 'password'},
    },
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
    // @ts-ignore
    const IGithub = new GitApiWrapper({
      // @ts-ignore
      token: RED.nodes.getNode(n.github).credentials.token,
    });
    // @ts-ignore
    const github: any = IGithub.gh;
    node.status({});
    node.on('input', function(msg: { payload: object }) {
      node.status({fill: 'blue', shape: 'ring', text: node.action});
      const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
      const repository_f = RED.util.evaluateNodeProperty(node.repository, node.repositoryType, node, msg);
      const repo = github.getRepo(username_f, repository_f);

      if(node.action === 'show') {
        node.log('show');
        node.status({fill: 'green', shape: 'ring'});
      }
    });
  }
  RED.nodes.registerType('github-repo', GithubRepo);

  function GithubUser(n: any) {
    // @ts-ignore
    const node: any = this;
    RED.nodes.createNode(node, n);

    node.action = n.action;
    node.options = n.options;
    node.optionsType = n.optionsType;
    node.username = n.username;
    node.usernameType = n.usernameType;
    node.orgname = n.orgname;
    node.orgnameType = n.orgnameType;

    // @ts-ignore
    const IGithub = new GitApiWrapper({
      // @ts-ignore
      token: RED.nodes.getNode(n.github).credentials.token,
    });
    node.on('input', async function(msg: { payload: object }) {
      // @ts-ignore
      user.processUserNode(node, RED, msg, IGithub);
    });
  }
  RED.nodes.registerType('github-user', GithubUser);

  function GithubMyUser(n: any) {
    // @ts-ignore
    const node = this;
    RED.nodes.createNode(node, n);
  }
  RED.nodes.registerType('github-myuser', GithubMyUser);
};
