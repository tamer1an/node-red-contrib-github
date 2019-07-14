import { NodeProperties, Red, Node } from 'node-red';
// @ts-ignore
import {GithubInterface} from "./gh/Github";

const GithubRepo = (n: any) => {
    // @ts-ignore
    const node: any = this;

    // @ts-ignore
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
    const IGithub = new GithubInterface({
        // @ts-ignore
        token: RED.nodes.getNode(n.github).credentials.token,
    });
    // @ts-ignore
    const github: any = IGithub.gh;
    node.status({});
    node.on('input', function(msg: { payload: object }) {
        node.status({fill: 'blue', shape: 'ring', text: node.action});
        // @ts-ignore
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        // @ts-ignore
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
            node.log('show if');
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
            // @ts-ignore
            const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
            // @ts-ignore
            const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
            repo.contents(branch_f, path_f, callbackErrData);
        } else if(node.action === 'read') {
            // @ts-ignore
            const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
            // @ts-ignore
            const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
            repo.read(branch_f, path_f, callbackErrData);
        } else if(node.action === 'write') {
            // @ts-ignore
            const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
            // @ts-ignore
            const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
            // @ts-ignore
            const contents_f = RED.util.evaluateNodeProperty(node.contents, node.contentsType, node, msg);
            const options = {};
            repo.write(branch_f, path_f, contents_f, 'Add ' + path_f, options, callbackErr);
        } else if(node.action === 'move') {
            // @ts-ignore
            const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
            // @ts-ignore
            const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
            // @ts-ignore
            const pathto_f = RED.util.evaluateNodeProperty(node.pathto, node.pathtoType, node, msg);
            repo.move(branch_f, path_f, pathto_f, callbackErr);
        } else if(node.action === 'remove') {
            // @ts-ignore
            const branch_f = RED.util.evaluateNodeProperty(node.branch, node.branchType, node, msg);
            // @ts-ignore
            const path_f = RED.util.evaluateNodeProperty(node.path, node.pathType, node, msg);
            repo.remove(branch_f, path_f, callbackErr);
        }
    });
}

module.exports = { GithubRepo: GithubRepo };