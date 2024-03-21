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
        const { redirect_uri, client_id, response_type = 'code', scope = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"], state = { code: (0, uuid_1.v4)() }, access_type = "offline", prompt = "consent" } = options;
        if (!redirect_uri || !client_id) {
            throw Error(`${errors_1.default.prefix} client_id, redirect_uri and scope must be a valid value`);
        }
        const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
        const urlOptions = {
            redirect_uri,
            client_id,
            access_type,
            response_type,
            prompt,
            scope: scope.join(" "),
            state: JSON.stringify(state)
        };
        return `${rootURL}?${querystring_1.default.stringify(urlOptions)}`;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - ${err}`);
    }
};
exports.redirectURL = redirectURL;
const userAuth = async (options, getClientSecret = true, tokens) => {
    try {
        const { client_id, client_secret, redirect_uri, code, grant_type = "authorization_code" } = options;
        if (getClientSecret === true) {
            if (!client_id || !redirect_uri || !code) {
                throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - client_id, redirect_uri and code must be a valid value!`);
            }
        }
        else {
            if (!client_id || !client_secret || !redirect_uri || !code) {
                throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - client_id, client_secret, redirect_uri and code must be a valid value!`);
            }
        }
        if (!tokens) {
            const tokenRootURL = "https://oauth2.googleapis.com/token";
            const tokenURLOptions = {
                client_secret: getClientSecret ? "31" : client_secret,
                redirect_uri,
                grant_type,
                client_id,
                code
            };
            const tokenResponse = await axios_1.default.post(tokenRootURL, querystring_1.default.stringify(tokenURLOptions), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            tokens = {
                access_token: tokenResponse.data.access_token,
                id_token: tokenResponse.data.id_token
            };
        }
        const googleUserResponse = await axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
            headers: {
                "Authorization": `Bearer ${tokens.id_token}`
            }
        });
        return googleUserResponse.data;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[1]} - ${err}`);
    }
};
exports.userAuth = userAuth;
exports.default = {
    redirectURL: exports.redirectURL,
    userAuth: exports.userAuth
};
