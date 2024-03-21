"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = exports.redirectURL = void 0;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const wix_secret_helpers_1 = require("@exweiv/wix-secret-helpers");
const errors_1 = __importDefault(require("../errors"));
const redirectURL = (options) => {
    try {
        const { redirect_uri, client_id, response_type = 'code', scope = 'email', state = undefined } = options;
        if (!redirect_uri || !client_id) {
            throw Error(`${errors_1.default.prefix} client_id and redirect_uri must be a valid value`);
        }
        const defaultState = {
            code: (0, uuid_1.v4)()
        };
        const facebookLoginURL = `https://www.facebook.com/v19.0/dialog/oauth?response_type=${response_type}&scope=${scope}&redirect_uri=${redirect_uri}&client_id=${client_id}&state=${JSON.stringify(!state ? defaultState : state)}`;
        return encodeURI(facebookLoginURL);
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[0]} ${err}`);
    }
};
exports.redirectURL = redirectURL;
const userAuth = async (options, getClientSecret = true, access_token) => {
    try {
        const { client_id, client_secret, redirect_uri, code, fields } = options;
        if (getClientSecret === true) {
            if (!client_id || !redirect_uri || !code) {
                throw Error(`${errors_1.default.prefix} client_id, redirect_uri and code must be a valid value!`);
            }
        }
        else {
            if (!client_id || !client_secret || !redirect_uri || !code) {
                throw Error(`${errors_1.default.prefix} client_id, client_secret, redirect_uri and code must be a valid value!`);
            }
        }
        if (!access_token) {
            const defaultClientSecret = getClientSecret ? await (0, wix_secret_helpers_1.getSecretValue)("FacebookClientSecret") : undefined;
            const fbTokenResponse = await axios_1.default.post(encodeURI(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${client_id}&client_secret=${getClientSecret ? defaultClientSecret : client_secret}&redirect_uri=${redirect_uri}&code=${code}`));
            access_token = fbTokenResponse.data.access_token;
        }
        const fbUserResponse = await axios_1.default.get(encodeURI(`https://graph.facebook.com/v19.0/me?fields=${!fields ? "email" : fields}&access_token=${access_token}`));
        const userData = fbUserResponse.data;
        return userData;
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
