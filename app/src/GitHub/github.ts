/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { github, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
import querystring from 'querystring';
// Internal Imports
import errCodes from '../Errors/errors';
import { copyOwnPropsOnly } from '../helpers';

export const redirectURL = (options: github.RedirectURLOptions): string => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const {
            client_id,
            redirect_uri,
            state,
            allow_signup
        } = copyOwnPropsOnly(options);

        if (!redirect_uri || !client_id) {
            throw Error(`${errCodes.prefix} ${errCodes.provider[2]} - client_id, redirect_uri and scope must be a valid value`);
        }

        const rootURL = "https://github.com/login/oauth/authorize";
        const urlOptions = {
            client_id,
            redirect_uri,
            state: !state ? JSON.stringify({ code: uuidv4() }) : state,
            allow_signup: !allow_signup ? true : allow_signup
        };

        return `${rootURL}?${querystring.stringify(urlOptions)}`;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[2]} - ${err}`);
    }
}

export const authUser = async (options: github.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse> => {
    try {
        if (typeof options !== "object" || typeof client_secret !== "string" || typeof access_token !== "string") {
            throw new Error("parameter types are invalied, options is object, client_secret and access_token is must be a string!");
        }

        const {
            client_id,
            code,
            redirect_uri,
            repository_id
        } = copyOwnPropsOnly(options);

        if (!access_token) {
            const tokens = await getTokens({
                client_secret: !client_secret ? await getSecretValue("GitHubClientSecret") : client_secret,
                client_id,
                code,
                redirect_uri,
                repository_id
            });
            access_token = tokens.access_token;
        }

        const githubUserResponse = await axios.get(`https://api.github.com/user`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${access_token}`,
                "X-github-Api-Version": "2022-11-28"
            }
        });
        return githubUserResponse.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[2]} - ${err}`);
    }
}

export const getTokens = async (options: github.TokensOptions): Promise<github.TokensResponse> => {
    try {
        if (typeof options !== "object") {
            throw new Error("parameter type is invalied, options must be an object!");
        }

        const tokenParams = new URLSearchParams();

        for (const [key, value] of Object.entries(copyOwnPropsOnly(options))) {
            tokenParams.append(key, value);
        }

        const tokens = await axios.post("https://github.com/login/oauth/access_token", tokenParams, {
            headers: {
                "Accept": "application/json"
            }
        });
        return tokens.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[2]} - ${err}`);
    }
}