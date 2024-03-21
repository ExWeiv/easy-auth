/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { Google, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
// import { getSecretValue } from '@exweiv/wix-secret-helpers';
import querystring from 'querystring';
// Internal Imports
import errCodes from '../Errors/errors';

export const redirectURL = (options: Google.RedirectURLOptions): string => {
    try {
        const {
            redirect_uri,
            client_id,
            response_type = 'code',
            scope = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
            state = { code: uuidv4() },
            access_type = "offline",
            prompt = "consent"
        } = options;

        if (!redirect_uri || !client_id) {
            throw Error(`${errCodes.prefix} client_id, redirect_uri and scope must be a valid value`);
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
        }

        return `${rootURL}?${querystring.stringify(urlOptions)}`;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - ${err}`);
    }
}

export const userAuth = async (options: Google.AuthOptions, getClientSecret: boolean = true, tokens?: Google.Tokens): Promise<AuthResponse> => {
    try {
        const { client_id, client_secret, redirect_uri, code, grant_type = "authorization_code" } = options;

        if (getClientSecret === true) {
            if (!client_id || !redirect_uri || !code) {
                throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - client_id, redirect_uri and code must be a valid value!`);
            }
        } else {
            if (!client_id || !client_secret || !redirect_uri || !code) {
                throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - client_id, client_secret, redirect_uri and code must be a valid value!`);
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
            }

            const tokenResponse = await axios.post(tokenRootURL, querystring.stringify(tokenURLOptions), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })

            tokens = {
                access_token: tokenResponse.data.access_token,
                id_token: tokenResponse.data.id_token
            };
        }

        const googleUserResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
            headers: {
                "Authorization": `Bearer ${tokens.id_token}`
            }
        });

        return googleUserResponse.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - ${err}`);
    }
}

export default {
    redirectURL,
    userAuth
}