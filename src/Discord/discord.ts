/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { Discord, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import querystring from 'querystring';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
// Internal Imports
import errCodes from '../Errors/errors';

export const redirectURL = (options: Discord.RedirectURLOptions): string => {
    try {
        const {
            client_id,
            redirect_uri,
            state,
            response_type,
            prompt,
            scope
        } = options;

        if (!redirect_uri || !client_id) {
            throw Error(`${errCodes.prefix} ${errCodes.provider[3]} - client_id, redirect_uri and scope must be a valid value`);
        }

        const rootURL = "https://discord.com/oauth2/authorize";
        const urlOptions = {
            client_id,
            redirect_uri,
            state: !state ? JSON.stringify({ code: uuidv4() }) : state,
            response_type: !response_type ? "code" : response_type,
            prompt: !prompt ? "consent" : prompt,
            scope: !scope ? ["identify", "email"].join("+") : scope
        };

        return `${rootURL}?${querystring.stringify(urlOptions)}`.replace("%2B", "+");
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[3]} - ${err}`);
    }
}

export const userAuth = async (options: Discord.AuthOptions, getClientSecret: boolean = true, access_token?: string): Promise<AuthResponse> => {
    try {
        const {
            code,
            redirect_uri,
            grant_type,
            client_id,
            client_secret,
        } = options;

        if (!access_token) {
            const tokenRootURL = "https://discord.com/api/oauth2/token";
            const tokenURLOptions = new URLSearchParams({
                code,
                redirect_uri,
                grant_type: !grant_type ? "authorization_code" : grant_type,
                client_secret: getClientSecret ? await getSecretValue("DiscordClientSecret") : client_secret,
                client_id
            });

            const tokenResponse = await axios.post(tokenRootURL, tokenURLOptions, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            access_token = tokenResponse.data.access_token;
        }


        const discordUserResponse = await axios.get(`https://discord.com/api/users/@me`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        });
        return discordUserResponse.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[3]} - ${err}`);
    }
}

export default {
    redirectURL,
    userAuth
}