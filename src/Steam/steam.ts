/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { Steam, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import axios from 'axios';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
import querystring from 'querystring';
// Internal Imports
import errCodes from '../Errors/errors';

export const redirectURL = (options: Steam.RedirectURLOptions): string => {
    try {
        const {
            realm,
            redirect_uri
        } = options;

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

export const authUser = async (options: Steam.AuthOptions, client_secret?: string): Promise<AuthResponse> => {
    try {
        const { steamId } = options;

        const steamUserResponse = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${!client_secret ? await getSecretValue("SteamClientSecret") : client_secret}&steamids=${steamId}`)
        const result = steamUserResponse.data;

        if (!(result && result.response && Array.isArray(result.response.players) && result.response.players.length > 0)) {
            throw new Error(`Malformed response while retrieving user's Steam profile information`);
        }

        return result.response.players[0];
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[4]} - ${err}`);
    }
}