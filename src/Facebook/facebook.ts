/// <reference path="../../types/index.d.ts" />

// Type Imports
import type { Facebook, AuthResponse } from '@exweiv/easy-auth';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import querystring from 'querystring';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
// Internal Imports
import errCodes from '../Errors/errors';

export const redirectURL = (options: Facebook.RedirectURLOptions): string => {
    try {
        const {
            redirect_uri,
            client_id,
            response_type,
            scope,
            state
        } = options;

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

export const userAuth = async (options: Facebook.AuthOptions, getClientSecret: boolean = true, access_token?: string): Promise<AuthResponse> => {
    try {
        const {
            client_id,
            client_secret,
            redirect_uri,
            code,
            fields
        } = options;

        if (getClientSecret === true) {
            if (!client_id || !redirect_uri || !code) {
                throw Error(`${errCodes.prefix} ${errCodes.provider[0]} - client_id and redirect_uri must be a valid value!`);
            }
        } else {
            if (!client_id || !client_secret || !redirect_uri || !code) {
                throw Error(`${errCodes.prefix} ${errCodes.provider[0]} - client_id, client_secret and redirect_uri must be a valid value!`);
            }
        }

        // Get User Access Token
        if (!access_token) {
            const tokenRootURL = "https://graph.facebook.com/v19.0/oauth/access_token";
            const tokenURLOptions = {
                client_id,
                client_secret: getClientSecret ? await getSecretValue("FacebookClientSecret") : client_secret,
                redirect_uri,
                code
            }

            const fbTokenResponse = await axios.post(tokenRootURL, querystring.stringify(tokenURLOptions));
            access_token = fbTokenResponse.data.access_token;
        }

        // Get User Data with User Token
        const fbUserResponse = await axios.get(encodeURI(`https://graph.facebook.com/v19.0/me?fields=${!fields ? "email" : fields.join(",")}&access_token=${access_token}`))
        return fbUserResponse.data;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[0]} ${err}`);
    }
}

export default {
    redirectURL,
    userAuth
}