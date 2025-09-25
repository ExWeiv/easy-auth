"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = exports.redirectURL = void 0;
const axios_1 = __importDefault(require("axios"));
const wix_secret_helpers_1 = require("@exweiv/wix-secret-helpers");
const querystring_1 = __importDefault(require("querystring"));
const errors_1 = __importDefault(require("../Errors/errors"));
const helpers_1 = require("../helpers");
const redirectURL = (options) => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }
        const { realm, redirect_uri } = (0, helpers_1.copyOwnPropsOnly)(options);
        const rootURL = "https://steamcommunity.com/openid/login";
        const urlOptions = {
            "openid.ns": "http://specs.openid.net/auth/2.0",
            "openid.mode": "checkid_setup",
            "openid.return_to": redirect_uri,
            "openid.realm": realm,
            "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
            "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
        };
        return `${rootURL}?${querystring_1.default.stringify(urlOptions)}`;
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[4]} - ${err}`);
    }
};
exports.redirectURL = redirectURL;
const authUser = async (options, client_secret) => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string") {
            throw new Error("parameter types are invalied, options is object and client_secret is must be a string!");
        }
        const { steamId } = (0, helpers_1.copyOwnPropsOnly)(options);
        const steamUserResponse = await axios_1.default.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${!client_secret ? await (0, wix_secret_helpers_1.getSecretValue)("SteamClientSecret") : client_secret}&steamids=${steamId}`);
        const result = steamUserResponse.data;
        if (!(result && result.response && Array.isArray(result.response.players) && result.response.players.length > 0)) {
            throw new Error(`Malformed response while retrieving user's steam profile information`);
        }
        return result.response.players[0];
    }
    catch (err) {
        throw Error(`${errors_1.default.prefix} ${errors_1.default.provider[4]} - ${err}`);
    }
};
exports.authUser = authUser;
