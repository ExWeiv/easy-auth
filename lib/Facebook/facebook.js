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
        const { redirect_uri, client_id, response_type = ['code'], scope = ['email'], state = { code: (0, uuid_1.v4)() } } = options;
        if (!redirect_uri || !client_id) {
            throw Error(`${errors_1.default.prefix} client_id and redirect_uri must be a valid value`);
        }
        const rootURL = "https://www.facebook.com/v19.0/dialog/oauth";
        const urlOptions = {
            response_type: response_type.join(","),
            scope: scope.join(","),
            redirect_uri,
            client_id,
            state: JSON.stringify(state)
        };
        return `${rootURL}?${querystring_1.default.stringify(urlOptions)}`;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} ${err}`);
    }
};
exports.redirectURL = redirectURL;
const userAuth = async (options, getClientSecret = true, access_token) => {
    try {
        const { client_id, client_secret, redirect_uri, code, fields = ["email"] } = options;
        if (getClientSecret === true) {
            if (!client_id || !redirect_uri || !code) {
                throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} - client_id and redirect_uri must be a valid value!`);
            }
        }
        else {
            if (!client_id || !client_secret || !redirect_uri || !code) {
                throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} - client_id, client_secret and redirect_uri must be a valid value!`);
            }
        }
        if (!access_token) {
            const tokenRootURL = "https://graph.facebook.com/v19.0/oauth/access_token";
            const tokenURLOptions = {
                client_id,
                client_secret: getClientSecret ? "31" : client_secret,
                redirect_uri,
                code
            };
            const fbTokenResponse = await axios_1.default.post(tokenRootURL, querystring_1.default.stringify(tokenURLOptions));
            access_token = fbTokenResponse.data.access_token;
        }
        const fbUserResponse = await axios_1.default.get(encodeURI(`https://graph.facebook.com/v19.0/me?fields=${fields.join(",")}&access_token=${access_token}`));
        return fbUserResponse.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} ${err}`);
    }
};
exports.userAuth = userAuth;
exports.default = {
    redirectURL: exports.redirectURL,
    userAuth: exports.userAuth
};
