/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { google, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
import querystring from 'querystring';
// Internal Imports
import errCodes from '../Errors/errors';
import { copyOwnPropsOnly } from '../helpers';

export const redirectURL = (options: google.RedirectURLOptions): string => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const {
            redirect_uri,
            client_id,
            response_type,
            scope,
            state,
            access_type,
            prompt
        } = copyOwnPropsOnly(options);

        if (!redirect_uri || !client_id) {
            throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - client_id, redirect_uri and scope must be a valid value`);
        }

        const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
        const urlOptions = {
            redirect_uri,
            client_id,
            access_type: !access_type ? "offline" : access_type,
            response_type: !response_type ? "code" : response_type,
            prompt: !prompt ? "consent" : prompt,
            scope: !scope ? ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" ") : scope.join(" "),
            state: !state ? JSON.stringify({ code: uuidv4() }) : state
        }

        return `${rootURL}?${querystring.stringify(urlOptions)}`;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - ${err}`);
    }
}

export const authUser = async (options: google.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse> => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string" || typeof access_token !== "string") {
            throw new Error("parameter types are invalied, options is object, client_secret and access_token is must be a string!");
        }

        const { client_id, redirect_uri, code, grant_type } = copyOwnPropsOnly(options);

        if (!client_id || !redirect_uri || !code) {
            throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - client_id, redirect_uri and code must be a valid value!`);
        }

        if (!access_token) {
            const tokens = await getTokens({
                client_secret: !client_secret ? await getSecretValue("GoogleClientSecret") : client_secret,
                redirect_uri,
                client_id,
                code,
                grant_type
            })
            access_token = tokens.access_token;
        }

        const googleUserResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
        return googleUserResponse.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - ${err}`);
    }
}

export const getTokens = async (options: google.TokensOptions): Promise<google.TokensResponse> => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const {
            client_id,
            client_secret,
            code,
            grant_type,
            redirect_uri,
            refresh_token
        } = copyOwnPropsOnly(options);

        const tokenParams = new URLSearchParams({
            grant_type: !grant_type ? "authorization_code" : grant_type,
            client_secret: !client_secret ? await getSecretValue("GoogleClientSecret") : client_secret,
            redirect_uri,
            client_id,
            code
        });

        if (refresh_token) {
            tokenParams.append("refresh_token", refresh_token);
        }

        const tokens = await axios.post("https://oauth2.googleapis.com/token", tokenParams, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return tokens.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[1]} - ${err}`);
    }
}