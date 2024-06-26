/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { discord, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import querystring from 'querystring';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
// Internal Imports
import errCodes from '../Errors/errors';
import { copyOwnPropsOnly } from '../helpers';

export const redirectURL = (options: discord.RedirectURLOptions): string => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const {
            client_id,
            redirect_uri,
            state,
            response_type,
            prompt,
            scope
        } = copyOwnPropsOnly(options);

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

export const authUser = async (options: discord.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse> => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string" || typeof access_token !== "string") {
            throw new Error("parameter types are invalied, options is object, client_secret and access_token is must be a string!");
        }

        const {
            code,
            redirect_uri,
            grant_type,
            client_id,
        } = copyOwnPropsOnly(options);

        if (!access_token) {
            const tokens = await getTokens({
                client_secret: !client_secret ? await getSecretValue("DiscordClientSecret") : client_secret,
                client_id,
                redirect_uri,
                grant_type: !grant_type ? "authorization_code" : grant_type,
                code
            });
            access_token = tokens.access_token;
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

export const getTokens = async (options: discord.TokensOptions): Promise<discord.TokensResponse> => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const tokenParams = new URLSearchParams();

        for (const [key, value] of Object.entries(copyOwnPropsOnly(options))) {
            tokenParams.append(key, value);
        }

        const tokens = await axios.post("https://discord.com/api/oauth2/token", tokenParams, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        return tokens.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[3]} - ${err}`);
    }
}