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
        const { client_id, redirect_uri, state, response_type, prompt, scope } = options;
        if (!redirect_uri || !client_id) {
            throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[3]} - client_id, redirect_uri and scope must be a valid value`);
        }
        const rootURL = "https://discord.com/oauth2/authorize";
        const urlOptions = {
            client_id,
            redirect_uri,
            state: !state ? JSON.stringify({ code: (0, uuid_1.v4)() }) : state,
            response_type: !response_type ? "code" : response_type,
            prompt: !prompt ? "consent" : prompt,
            scope: !scope ? ["identify", "email"].join("+") : scope
        };
        return `${rootURL}?${querystring_1.default.stringify(urlOptions)}`.replace("%2B", "+");
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[3]} - ${err}`);
    }
};
exports.redirectURL = redirectURL;
const userAuth = async (options, getClientSecret = true, access_token) => {
    try {
        const { code, redirect_uri, grant_type, client_id, client_secret, } = options;
        if (!access_token) {
            const tokenRootURL = "https://discord.com/api/oauth2/token";
            const tokenURLOptions = new URLSearchParams({
                code,
                redirect_uri,
                grant_type: !grant_type ? "authorization_code" : grant_type,
                client_secret: getClientSecret ? `await getSecretValue("DiscordClientSecret")` : client_secret,
                client_id
            });
            const tokenResponse = await axios_1.default.post(tokenRootURL, tokenURLOptions, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            access_token = tokenResponse.data.access_token;
        }
        const discordUserResponse = await axios_1.default.get(`https://discord.com/api/users/@me`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        });
        return discordUserResponse.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[3]} - ${err}`);
    }
};
exports.userAuth = userAuth;
exports.default = {
    redirectURL: exports.redirectURL,
    userAuth: exports.userAuth
};
