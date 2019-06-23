// @ts-ignore
import GitHub from 'github-api';
import {object, string} from "prop-types";

const local = { log: (msg: any, msg2?: any) => {} };

class GithubInterface {
  user: object;
  // @ts-ignore
  _gh: object;

  static newGit(username: string, password: string, token?: string, baseUrl = 'https://api.github.com') {
    let gh;
    if (token) {
      gh = new GitHub({
        auth: 'oauth',
        token,
      }, baseUrl);
    } else {
      gh = new GitHub({
        username,
        password,
      }, baseUrl);
    }
    return gh;
  }

  static defaultProps = {
    username: 'tamer1an',
    reponame: 'react-app-submodule ',
  };

  constructor(config: {username: string, password: string, token?: string}) {
   this.user = {};
    const gh = (config.username && config.password || config.token)
        ? this.setGit(GithubInterface.newGit(config.username, config.password, config.token))
        : { error: 'Error auth' };

    // @ts-ignore
    return {
    // @ts-ignore
      instance: this,
      gh,
    };
  }

  getGit() {
    return this._gh;
  }

  async getAllUsersOrganizations() {
    return await Promise.all([
      this.allOrganizations(0),
      this.allOrganizations(420),
      this.allOrganizations(1115),
    ]);
  }

  // @ts-ignore
  allOrganizations(page = 0, user = this.getUser(), pthen = responseText => {
    const resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
    local.log(resp);
    return resp;
  }, pcatch = (err: any) => local.log(err)) {
    return fetch(`${user.__apiBase}/organizations?since=${page}`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: user.__authorizationHeader,
        Accept: 'application/vnd.github.luke-cage-preview+json',
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
        Connection: 'keep-alive',
        Host: 'github.com',
        Origin: 'http://localhost:8888',
        Referer: 'http://localhost:8888/dev/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36' +
          '(KHTML, like Gecko) Chrome/54.0.2832.2 Safari/537.36',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(pthen).catch(pcatch);
  }

  // @ts-ignore
  setGit(gh = GithubInterface.newGit()) {
    this._gh = gh;
    return gh;
  }

  getUser(user: string) {
    const u = user || 'me';
    const git = this.getGit();

    // @ts-ignore
    if (!this.user[u] && u !== 'me') {
      // @ts-ignore
      this.user[u] = git.getUser(u);
    } else if (u === 'me') {
      // @ts-ignore
      this.user[u] = git.getUser();
    }

    // @ts-ignore
    return this.user[u];
  }

  getProtectionInfo(reposBranchesToProtect: Array<object>, org: string) {
    return reposBranchesToProtect.map((result: Object) => {
      const itemName: string = Object.keys(result)[0];
      // @ts-ignore
      const item = result[itemName];
      return item.branches.map((branch: { name: string}) => {
        const url = item.url.replace('{/branch}', `/${branch.name}`);
        // @ts-ignore
        return this.listBranchProtection({ url })
          .then((protection: object) => ({
            org,
            repo: itemName,
            name: branch.name,
            protection,
            url,
          }));
      });
    });
  }

  /**
   * Loop through the repos array and find if exist
   * branches that in branch set plus, default_branch enabled by deafult
   * @param repos
   * @param org
   * @param branchesSet
   * @param defaultBranch
   * @returns {*}
   */
  getReposBranchesIfExist(
    repos: Array<{ name: string}>,
    org = 'tamer1an',
    branchesSet = ['master', 'develop'],
    defaultBranch = true
  ) {
    return repos.map(repo => this.getGit()
    // @ts-ignore
      .getRepo(org, repo.name)
    // @ts-ignore
      .listBranches().then(({ data }) => {
        const toProtect = data.filter((item: { name:string }) => branchesSet.some(v => v === item.name));

        // @ts-ignore
          if (defaultBranch && !toProtect.some(v => v.name === repo.default_branch)) {
        // @ts-ignore
          toProtect.push({ name: repo.default_branch });
        }

        return {
          [repo.name]: {
        // @ts-ignore
            url: repo.branches_url,
            branches: toProtect,
          },
        };
      })
    );
  }

  getOrganisationRepos(org: string) {
    // @ts-ignore
    return this.getGit().getOrganization(org).getRepos();
  }

  listUserRepos(
    user = this.getUser(GithubInterface.defaultProps.username),
    pthen = (data: { data: object }) => data.data) {
    return user.listRepos().then(pthen);
  }

  getUserEmails(
    user = this.getUser(GithubInterface.defaultProps.username),
    pthen = (data: { data: object }) => local.log('emails', data.data)) {
    return user.getEmails().then(pthen);
  }

  listStarredRepos(
    user = this.getUser(GithubInterface.defaultProps.username),
  // @ts-ignore
    pthen = (err, repos) => local.log('stars', repos.slice(1, 6))) {
    return user.listStarredRepos(pthen);
  }

  listIssues(
    user = GithubInterface.defaultProps.username,
    repo = GithubInterface.defaultProps.reponame,
    pthen = (data: object) => data
  ) {
    // @ts-ignore
    const remoteIssues = this.getGit().getIssues(user, repo);
    return remoteIssues.listIssues({}, pthen);
  }

  listNotifications(pthen = (data: { data: object }) => data.data) {
    // @ts-ignore
    return this.getUser().listNotifications().then(pthen);
  }

  // @ts-ignore
  listBranchProtection({ url, branch }, user = this.getUser(), pthen = responseText => {
    const resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
    return resp;
  // @ts-ignore
  }, pcatch = err => local.log(err)) {
    return fetch(`${url}/protection`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: user.__authorizationHeader,
        Accept: 'application/vnd.github.luke-cage-preview+json',
        Connection: 'keep-alive',
        Host: 'github.com',
        Origin: 'http://localhost:8888',
        Referer: 'http://localhost:8888/dev/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36' +
          '(KHTML, like Gecko) Chrome/54.0.2832.2 Safari/537.36',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(pthen).catch(pcatch);
  }

  setBranchProtection(
  // @ts-ignore
    { url },
    protectionOptions = {
      required_pull_request_reviews: {
        dismiss_stale_reviews: true,
        require_code_owner_reviews: false,
      },
      enforce_admins: false,
      restrictions: null,
      required_status_checks: null,
    },
    pthen = (responseText: JSON) => {
      const resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
      return resp;
    },
  // @ts-ignore
    user = this.getUser(),
  // @ts-ignore
    pcatch = err => local.log(err),
  ) {
    protectionOptions.restrictions = protectionOptions.restrictions ? protectionOptions.restrictions : null;
    return fetch(`${url}/protection`, {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(protectionOptions),
      headers: {
        Authorization: user.__authorizationHeader,
        Accept: 'application/vnd.github.luke-cage-preview+json',
        Connection: 'keep-alive',
        Host: 'github.com',
        Origin: 'http://localhost:8888',
        Referer: 'http://localhost:8888/dev/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36' +
          '(KHTML, like Gecko) Chrome/54.0.2832.2 Safari/537.36',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(pthen).catch(pcatch);
  }
  // @ts-ignore
  listUserIssues(user = this.getUser(), pthen = responseText => {
    const resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
    local.log(resp);
    return resp;
  // @ts-ignore
  }, pcatch = err => local.log(err)) {
    return fetch(`${user.__apiBase}/issues`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: user.__authorizationHeader,
        Accept: 'application/vnd.github.luke-cage-preview+json',
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
        Connection: 'keep-alive',
        Host: 'github.com',
        Origin: 'http://localhost:8888',
        Referer: 'http://localhost:8888/dev/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36' +
          '(KHTML, like Gecko) Chrome/54.0.2832.2 Safari/537.36',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(pthen).catch(pcatch);
  }

  static wrapFetchArr(
    branchesPromise: Promise<object>,
    resolveCatch = (message: object) => ({
      error: {
        message,
        branches: [],
      },
    }),
  // @ts-ignore
    then = thenData => thenData
  ) {
    // @ts-ignore
    return branchesPromise.map((promise: Promise<object>) =>
      new Promise(
        resolve =>
          promise
            .then((v: object) => resolve(then(v)))
            // @ts-ignore
            .catch(({ message }) => {
              resolve(resolveCatch(message));
            })
      ));
  }
}

export { GithubInterface };