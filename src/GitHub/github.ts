/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { GitHub, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
// import { getSecretValue } from '@exweiv/wix-secret-helpers';
import querystring from 'querystring';
// Internal Imports
import errCodes from '../Errors/errors';

export const redirectURL = (options: GitHub.RedirectURLOptions): string => {
    try {
        const {
            client_id,
            redirect_uri,
            state,
            allow_signup
        } = options;

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

export const userAuth = async (options: GitHub.AuthOptions, getClientSecret: boolean = true): Promise<AuthResponse> => {
    try {
        const {
            client_id,
            client_secret,
            code,
            redirect_uri,
            repository_id
        } = options;

        const tokenRootURL = "https://github.com/login/oauth/access_token";
        const tokenURLOptions = {
            client_id,
            client_secret: getClientSecret != true ? client_secret : `await getSecretValue("GitHubClientSecret")`,
            code,
            redirect_uri,
            repository_id
        };

        if (!repository_id) {
            delete tokenURLOptions.repository_id;
        }

        const tokenResponse = await axios.post(tokenRootURL, querystring.stringify(tokenURLOptions), {
            headers: {
                "Accept": "application/json"
            }
        });
        const { access_token } = tokenResponse.data;

        const githubUserResponse = await axios.get(`https://api.github.com/user`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${access_token}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        return githubUserResponse.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[2]} - ${err}`);
    }
}

export default {
    redirectURL,
    userAuth
}