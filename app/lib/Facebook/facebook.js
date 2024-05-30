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
        const { redirect_uri, client_id, response_type, scope, state } = (0, helpers_1.copyOwnPropsOnly)(options);
        if (!redirect_uri || !client_id) {
            throw Error(`${errors_1.default.prefix} client_id and redirect_uri must be a valid value`);
        }
        const rootURL = "https://www.facebook.com/v19.0/dialog/oauth";
        const urlOptions = {
            response_type: !response_type ? ['code'] : response_type.join(","),
            scope: !scope ? ['email'] : scope.join(","),
            redirect_uri,
            client_id,
            state: !state ? JSON.stringify({ code: (0, uuid_1.v4)() }) : state
        };
        return `${rootURL}?${querystring_1.default.stringify(urlOptions)}`;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} ${err}`);
    }
};
exports.redirectURL = redirectURL;
const authUser = async (options, client_secret, access_token) => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string" || typeof access_token !== "string") {
            throw new Error("parameter types are invalied, options is object, client_secret and access_token is must be a string!");
        }
        const { client_id, redirect_uri, code, fields } = (0, helpers_1.copyOwnPropsOnly)(options);
        if (!client_id || !redirect_uri) {
            throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} - client_id and redirect_uri must be a valid value!`);
        }
        if (!access_token) {
            const tokens = await (0, exports.getTokens)({
                client_secret: !client_secret ? await (0, wix_secret_helpers_1.getSecretValue)("FacebookClientSecret") : client_secret,
                client_id,
                redirect_uri,
                code
            });
            access_token = tokens.access_token;
        }
        const fbUserResponse = await axios_1.default.get(encodeURI(`https://graph.facebook.com/v19.0/me?fields=${!fields ? "email" : fields.join(",")}&access_token=${access_token}`));
        return fbUserResponse.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} ${err}`);
    }
};
exports.authUser = authUser;
const getTokens = async (options) => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }
        const { client_id, client_secret, redirect_uri, code, fb_exchange_token, grant_type } = (0, helpers_1.copyOwnPropsOnly)(options);
        const tokenParams = new URLSearchParams({
            client_id,
            client_secret: !client_secret ? await (0, wix_secret_helpers_1.getSecretValue)("GoogleClientSecret") : client_secret,
        });
        if (redirect_uri)
            tokenParams.append("redirect_uri", redirect_uri);
        if (code)
            tokenParams.append("code", code);
        if (fb_exchange_token)
            tokenParams.append("fb_exchange_token", fb_exchange_token);
        if (grant_type) {
            tokenParams.append("grant_type", grant_type);
        }
        const tokens = await axios_1.default.post("https://graph.facebook.com/v19.0/oauth/access_token", tokenParams);
        return tokens.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} ${err}`);
    }
};
exports.getTokens = getTokens;
