/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { steam, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import axios from 'axios';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
import querystring from 'querystring';
// Internal Imports
import errCodes from '../Errors/errors';
import { copyOwnPropsOnly } from '../helpers';

export const redirectURL = (options: steam.RedirectURLOptions): string => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const {
            realm,
            redirect_uri
        } = copyOwnPropsOnly(options);

        const rootURL = "https://steamcommunity.com/openid/login";
        const urlOptions = {
            "openid.ns": "http://specs.openid.net/auth/2.0",
            "openid.mode": "checkid_setup",
            "openid.return_to": redirect_uri,
            "openid.realm": realm,
            "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
            "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
        }

        return `${rootURL}?${querystring.stringify(urlOptions)}`;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[4]} - ${err}`);
    }
}

export const authUser = async (options: steam.AuthOptions, client_secret?: string): Promise<AuthResponse> => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string") {
            throw new Error("parameter types are invalied, options is object and client_secret is must be a string!");
        }

        const { steamId } = copyOwnPropsOnly(options);

        const steamUserResponse = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${!client_secret ? await getSecretValue("SteamClientSecret") : client_secret}&steamids=${steamId}`)
        const result = steamUserResponse.data;

        if (!(result && result.response && Array.isArray(result.response.players) && result.response.players.length > 0)) {
            throw new Error(`Malformed response while retrieving user's steam profile information`);
        }

        return result.response.players[0];
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[4]} - ${err}`);
    }
}