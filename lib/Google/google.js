"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = exports.authUser = exports.redirectURL = void 0;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const errors_1 = __importDefault(require("../Errors/errors"));
const redirectURL = (options) => {
    try {
        const { redirect_uri, client_id, response_type, scope, state, access_type, prompt } = options;
        if (!redirect_uri || !client_id) {
            throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - client_id, redirect_uri and scope must be a valid value`);
        }
        const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
        const urlOptions = {
            redirect_uri,
            client_id,
            access_type: !access_type ? "offline" : access_type,
            response_type: !response_type ? "code" : response_type,
            prompt: !prompt ? "consent" : prompt,
            scope: !scope ? ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" ") : scope.join(" "),
            state: !state ? JSON.stringify({ code: (0, uuid_1.v4)() }) : state
        };
        return `${rootURL}?${querystring_1.default.stringify(urlOptions)}`;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - ${err}`);
    }
};
exports.redirectURL = redirectURL;
const authUser = async (options, client_secret, access_token) => {
    try {
        const { client_id, redirect_uri, code, grant_type } = options;
        if (!client_id || !redirect_uri || !code) {
            throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - client_id, redirect_uri and code must be a valid value!`);
        }
        if (!access_token) {
            const tokens = await (0, exports.getTokens)({
                client_secret: !client_secret ? `await getSecretValue("GoogleClientSecret")` : client_secret,
                redirect_uri,
                client_id,
                code,
                grant_type
            });
            access_token = tokens.access_token;
        }
        const googleUserResponse = await axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
        return googleUserResponse.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - ${err}`);
    }
};
exports.authUser = authUser;
const getTokens = async (options) => {
    try {
        const { client_id, client_secret, code, grant_type, redirect_uri, refresh_token } = options;
        const tokenParams = new URLSearchParams({
            grant_type: !grant_type ? "authorization_code" : grant_type,
            client_secret: !client_secret ? `await getSecretValue("GoogleClientSecret")` : client_secret,
            redirect_uri,
            client_id,
            code
        });
        if (refresh_token) {
            tokenParams.append("refresh_token", refresh_token);
        }
        const tokens = await axios_1.default.post("https://oauth2.googleapis.com/token", tokenParams, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return tokens.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - ${err}`);
    }
};
exports.getTokens = getTokens;
