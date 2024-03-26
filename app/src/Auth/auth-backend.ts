/// <reference path="../../types/wix-members-backend.d.ts" />
/// <reference path="../../types/index.d.ts" />

import { prefix } from '../Errors/errors';
import { authentication } from 'wix-members-backend';
import { oauth } from '@exweiv/easy-auth';
import * as providers from '../index';

export async function getSessionToken(provider: oauth.OAuthProviders, options: oauth.OAuthOptions, access_token: string): Promise<string> {
    try {
        const response = await providers[provider].authUser(options, undefined, access_token);
        const email = response.email;
        const sessionToken = await authentication.generateSessionToken(email);
        return sessionToken;
    } catch (err) {
        throw Error(`${prefix} ${provider} - failed to login member with email.`);
    }
}