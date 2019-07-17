import {GithubInterface} from "./git-api-wrapper/";

const processUserNode = async (node: any, RED: any, msg: object, {instance, gh: github}: any) => {
    if(node.action === 'repos') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
    } else if(node.action === 'orgs') {
    } else if(node.action === 'gists') {
    } else if(node.action === 'notifications') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
    } else if(node.action === 'show') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        node.log(username_f);
    } else if(node.action === 'userrepos') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        const { data: payload } = await github.getUser(username_f).listRepos();
        node.status({ text: `items ${payload.length}` });
        node.send({ payload });
    } else if(node.action === 'userstarred') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
        // const { data: payload } = await github.getUser(username_f).listStarredRepos();
        const payload = await instance.allStars();
        node.status({ text: `items ${payload.length}` });
        // node.send({ payload });
    } else if(node.action === 'createrepo') {
        const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
    } else if(node.aciton === 'orgrepos') {
        const orgname_f = RED.util.evaluateNodeProperty(node.orgname, node.orgnameType, node, msg);
    } else if(node.action === 'usergists') {
        const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
    }
};

module.exports = { processUserNode };