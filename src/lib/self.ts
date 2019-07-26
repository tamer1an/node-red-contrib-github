import { GitApiWrapper } from './git-api-wrapper';
const fetch = require('node-fetch');

const processUserNode = async (node: any, RED: any, msg: {payload: Array<{url: string}>}, {instance, gh: github}: any) => {
    if(node.action === 'repos') {
        // @ts-ignore
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        // user.repos(options_f, callbackErrData);
    } else if(node.action === 'orgs') {
        // user.orgs(callbackErrData);
    } else if(node.action === 'gists') {
        // user.gists(callbackErrData);
    } else if(node.action === 'notifications') {
        // @ts-ignore
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        // const ghUser = await github.getUser(options_f);
        // const payload = await ghUser.listNotifications(options_f);
        // return { payload };
    } else if(node.action === 'show') {
        // @ts-ignore
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        // user.show(username_f, callbackErrData);
    } else if(node.action === 'userrepos') {
        // @ts-ignore
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        const ghUser = await github.getUser(username_f);
        const payload = await ghUser.listRepos();
        return { payload };
    } else if(node.action === 'userstarred') {
        // @ts-ignore
        // const filename = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        const itemsSize = msg.payload.length-1;
        let cursor = 0;
        while (cursor<itemsSize) {
            const url: string = msg.payload[cursor].url;
            const result: Request = await fetch(url);
            await new Promise(r => setTimeout(() => r(true), 2700));
            cursor++;
            const payload: string = await result.text();
            node.send({
                payload,
            });
            node.status({ text: `current item ${cursor} = ${url}` });
        }
    } else if(node.action === 'createrepo') {
        // @ts-ignore
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
        // user.createRepo(options_f, callbackErrData);
    } else if(node.aciton === 'orgrepos') {
        // @ts-ignore
        const orgname_f = RED.util.evaluateNodeProperty(node.orgname, node.orgnameType, node, msg);
        // user.orgRepos(orgname_f, callbackErrData);
    } else if(node.action === 'usergists') {
        // @ts-ignore
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        // user.userGists(username_f, callbackErrData);
    }
};

module.exports = { processUserNode };

