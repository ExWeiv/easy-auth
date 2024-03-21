/// <reference path="../../types/easy-auth-facebook.d.ts" />

// Type Imports
import type { FacebookRedirectURLOptions, FacebookAuthOptions, FacebookAuthResponse } from '@exweiv/easy-auth/facebook';
// API Imports
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { getSecretValue } from '@exweiv/wix-secret-helpers';
// Internal Imports
import errCodes from '../errors';

export const redirectURL = (options: FacebookRedirectURLOptions): string => {
    try {
        const { redirect_uri, client_id, response_type = 'code', scope = 'email', state = undefined } = options;

        if (!redirect_uri || !client_id) {
            throw Error(`${errCodes.prefix} client_id and redirect_uri must be a valid value`);
        }

        const defaultState = {
            code: uuidv4()
        }

        const facebookLoginURL = `https://www.facebook.com/v19.0/dialog/oauth?response_type=${response_type}&scope=${scope}&redirect_uri=${redirect_uri}&client_id=${client_id}&state=${JSON.stringify(!state ? defaultState : state)}`;
        return encodeURI(facebookLoginURL);
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[0]} ${err}`);
    }
}

export const userAuth = async (options: FacebookAuthOptions, getClientSecret: boolean = true, access_token?: string): Promise<FacebookAuthResponse> => {
    try {
        const { client_id, client_secret, redirect_uri, code, fields } = options;

        if (getClientSecret === true) {
            if (!client_id || !redirect_uri || !code) {
                throw Error(`${errCodes.prefix} client_id, redirect_uri and code must be a valid value!`);
            }
        } else {
            if (!client_id || !client_secret || !redirect_uri || !code) {
                throw Error(`${errCodes.prefix} client_id, client_secret, redirect_uri and code must be a valid value!`);
            }
        }

        // Get User Access Token
        if (!access_token) {
            // Get Facebook client secret from secrets manager
            const defaultClientSecret = getClientSecret ? await getSecretValue("FacebookClientSecret") : undefined;
            const fbTokenResponse = await axios.post(encodeURI(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${client_id}&client_secret=${getClientSecret ? defaultClientSecret : client_secret}&redirect_uri=${redirect_uri}&code=${code}`))
            access_token = fbTokenResponse.data.access_token;
        }

        // Get User Data with User Token
        const fbUserResponse = await axios.get(encodeURI(`https://graph.facebook.com/v19.0/me?fields=${!fields ? "email" : fields}&access_token=${access_token}`))
        const userData = fbUserResponse.data;
        return userData;
    } catch (err) {
        throw Error(`${errCodes.prefix} ${errCodes.provider[0]} ${err}`);
    }
}

export default {
    redirectURL,
    userAuth
}