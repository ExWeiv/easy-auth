"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = exports.authUser = exports.redirectURL = void 0;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const wix_secret_helpers_1 = require("@exweiv/wix-secret-helpers");
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
const authUser = async (options, client_secret, access_token) => {
    try {
        const { client_id, code, redirect_uri, repository_id } = options;
        if (!access_token) {
            const tokens = await (0, exports.getTokens)({
                client_secret: !client_secret ? await (0, wix_secret_helpers_1.getSecretValue)("GitHubClientSecret") : client_secret,
                client_id,
                code,
                redirect_uri,
                repository_id
            });
            access_token = tokens.access_token;
        }
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
exports.authUser = authUser;
const getTokens = async (options) => {
    try {
        const tokenParams = new URLSearchParams();
        for (const [key, value] of Object.entries(options)) {
            tokenParams.append(key, value);
        }
        const tokens = await axios_1.default.post("https://github.com/login/oauth/access_token", tokenParams, {
            headers: {
                "Accept": "application/json"
            }
        });
        return tokens.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[2]} - ${err}`);
    }
};
exports.getTokens = getTokens;
