import {GithubInterface} from "./gh/Github";

const GithubUser = (n: any) => {
    // @ts-ignore
    const node: any = this;
    // @ts-ignore
    RED.nodes.createNode(node, n);

    node.action = n.action;
    node.options = n.options;
    node.optionsType = n.optionsType;
    node.username = n.username;
    node.usernameType = n.usernameType;
    node.orgname = n.orgname;
    node.orgnameType = n.orgnameType;

    // @ts-ignore
    const IGithub = new GithubInterface({
        // @ts-ignore
        token: RED.nodes.getNode(n.github).credentials.token,
    });
    const github: any = IGithub.gh;
    const user = github.getUser();

    // node.status({});
    // const github = new GithubInterface();

    node.on('input', async function(msg: { payload: object }) {
        function callbackErrData(err: Error, data: object) {
            if(err) {
                node.error(err);
            } else {
                msg.payload = data;
                node.send(msg);
            }
        }

        if(node.action === 'repos') {
            // @ts-ignore
            const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
            user.repos(options_f, callbackErrData);
        } else if(node.action === 'orgs') {
            user.orgs(callbackErrData);
        } else if(node.action === 'gists') {
            user.gists(callbackErrData);
        } else if(node.action === 'notifications') {
            // @ts-ignore
            const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
            user.notifications(options_f, callbackErrData);
        } else if(node.action === 'show') {
            // @ts-ignore
            const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
            // user.show(username_f, callbackErrData);
            node.log(username_f);
        } else if(node.action === 'userrepos') {
            // @ts-ignore
            const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
            const ghUser = await github.getUser(username_f);
            const payload = await ghUser.listRepos();
            return { payload };
        } else if(node.action === 'userstarred') {
            // @ts-ignore
            const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
            const ghUser = await github.getUser(username_f);
            const payload = await ghUser.listRepos();
            node.status({ text: `items` });
            return { payload };
        } else if(node.action === 'createrepo') {
            // @ts-ignore
            const options_f = RED.util.evaluateNodeProperty(node.options, node.optionsType, node, msg);
            user.createRepo(options_f, callbackErrData);
        } else if(node.aciton === 'orgrepos') {
            // @ts-ignore
            const orgname_f = RED.util.evaluateNodeProperty(node.orgname, node.orgnameType, node, msg);
            user.orgRepos(orgname_f, callbackErrData);
        } else if(node.action === 'usergists') {
            // @ts-ignore
            const username_f = RED.util.evaluateNodeProperty(node.username, node.usernameType, node, msg);
            user.userGists(username_f, callbackErrData);
        }
    });
}

module.exports = { GithubUser: GithubUser };