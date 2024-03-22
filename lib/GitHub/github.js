"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = exports.redirectURL = void 0;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const errors_1 = __importDefault(require("../Errors/errors"));
const redirectURL = (options) => {
    try {
        const { client_id, redirect_uri, state, allow_signup } = options;
        if (!redirect_uri || !client_id) {
            throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[2]} - client_id, redirect_uri and scope must be a valid value`);
        }
        const rootURL = "https://github.com/login/oauth/authorize";
        const urlOptions = {
            client_id,
            redirect_uri,
            state: !state ? JSON.stringify({ code: (0, uuid_1.v4)() }) : state,
            allow_signup: !allow_signup ? true : allow_signup
        };
        return `${rootURL}?${querystring_1.default.stringify(urlOptions)}`;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[2]} - ${err}`);
    }
};
exports.redirectURL = redirectURL;
const userAuth = async (options, getClientSecret = true) => {
    try {
        const { client_id, client_secret, code, redirect_uri, repository_id } = options;
        const tokenRootURL = "https://github.com/login/oauth/access_token";
        const tokenURLOptions = {
            client_id,
            client_secret: getClientSecret != true ? client_secret : `await getSecretValue("GitHubClientSecret")`,
            code,
            redirect_uri,
            repository_id
        };
        if (!repository_id) {
            delete tokenURLOptions.repository_id;
        }
        const tokenResponse = await axios_1.default.post(tokenRootURL, querystring_1.default.stringify(tokenURLOptions), {
            headers: {
                "Accept": "application/json"
            }
        });
        const { access_token } = tokenResponse.data;
        const githubUserResponse = await axios_1.default.get(`https://api.github.com/user`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${access_token}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        return githubUserResponse.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[2]} - ${err}`);
    }
};
exports.userAuth = userAuth;
exports.default = {
    redirectURL: exports.redirectURL,
    userAuth: exports.userAuth
};
