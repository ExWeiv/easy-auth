"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = exports.authUser = exports.redirectURL = void 0;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const wix_secret_helpers_1 = require("@exweiv/wix-secret-helpers");
const errors_1 = __importDefault(require("../Errors/errors"));
const helpers_1 = require("../helpers");
const redirectURL = (options) => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }
        const { client_id, redirect_uri, state, response_type, prompt, scope } = (0, helpers_1.copyOwnPropsOnly)(options);
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
const authUser = async (options, client_secret, access_token) => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string" || typeof access_token !== "string") {
            throw new Error("parameter types are invalied, options is object, client_secret and access_token is must be a string!");
        }
        const { code, redirect_uri, grant_type, client_id, } = (0, helpers_1.copyOwnPropsOnly)(options);
        if (!access_token) {
            const tokens = await (0, exports.getTokens)({
                client_secret: !client_secret ? await (0, wix_secret_helpers_1.getSecretValue)("DiscordClientSecret") : client_secret,
                client_id,
                redirect_uri,
                grant_type: !grant_type ? "authorization_code" : grant_type,
                code
            });
            access_token = tokens.access_token;
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
exports.authUser = authUser;
const getTokens = async (options) => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }
        const tokenParams = new URLSearchParams();
        for (const [key, value] of Object.entries((0, helpers_1.copyOwnPropsOnly)(options))) {
            tokenParams.append(key, value);
        }
        const tokens = await axios_1.default.post("https://discord.com/api/oauth2/token", tokenParams, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return tokens.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[3]} - ${err}`);
    }
};
exports.getTokens = getTokens;
