/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { facebook, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import querystring from 'querystring';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
// Internal Imports
import errCodes from '../Errors/errors';
import { copyOwnPropsOnly } from '../helpers';

export const redirectURL = (options: facebook.RedirectURLOptions): string => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const {
            redirect_uri,
            client_id,
            response_type,
            scope,
            state
        } = copyOwnPropsOnly(options);

        if (!redirect_uri || !client_id) {
            throw Error(`${errCodes.prefix} client_id and redirect_uri must be a valid value`);
        }

        const rootURL = "https://www.facebook.com/v19.0/dialog/oauth";
        const urlOptions = {
            response_type: !response_type ? ['code'] : response_type.join(","),
            scope: !scope ? ['email'] : scope.join(","),
            redirect_uri,
            client_id,
            state: !state ? JSON.stringify({ code: uuidv4() }) : state
        }

        return `${rootURL}?${querystring.stringify(urlOptions)}`;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[0]} ${err}`);
    }
}

export const authUser = async (options: facebook.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse> => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string" || typeof access_token !== "string") {
            throw new Error("parameter types are invalied, options is object, client_secret and access_token is must be a string!");
        }

        const { client_id, redirect_uri, code, fields } = copyOwnPropsOnly(options);

        if (!client_id || !redirect_uri) {
            throw Error(`${errCodes.prefix} ${errCodes.provider[0]} - client_id and redirect_uri must be a valid value!`);
        }

        if (!access_token) {
            const tokens = await getTokens({
                client_secret: !client_secret ? await getSecretValue("FacebookClientSecret") : client_secret,
                client_id,
                redirect_uri,
                code
            });
            access_token = tokens.access_token;
        }

        const fbUserResponse = await axios.get(encodeURI(`https://graph.facebook.com/v19.0/me?fields=${!fields ? "email" : fields.join(",")}&access_token=${access_token}`))
        return fbUserResponse.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[0]} ${err}`);
    }
}

export const getTokens = async (options: facebook.TokensOptions): Promise<facebook.TokensResponse> => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const {
            client_id,
            client_secret,
            redirect_uri,
            code,
            fb_exchange_token,
            grant_type
        } = copyOwnPropsOnly(options);

        const tokenParams = new URLSearchParams({
            client_id,
            client_secret: !client_secret ? await getSecretValue("GoogleClientSecret") : client_secret,
        });

        if (redirect_uri)
            tokenParams.append("redirect_uri", redirect_uri);
        if (code)
            tokenParams.append("code", code);
        if (fb_exchange_token)
            tokenParams.append("fb_exchange_token", fb_exchange_token);
        if (grant_type) {
            tokenParams.append("grant_type", grant_type);
        }

        const tokens = await axios.post("https://graph.facebook.com/v19.0/oauth/access_token", tokenParams);
        return tokens.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[0]} ${err}`);
    }
}