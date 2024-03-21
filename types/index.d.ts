/**
 * Easy Auth is a package to let you integrate some popular OAuth providers with `wix-members` platform in your Wix powered web application.
 * This NPM package is not designed for basic users or basic use cases it's more about having the control of everything and being able to customize most of the things.
 * 
 * If you need something basic then you should install the Easy Auth application from Wix App Market and use pre-built widgets with your own setup.
 */
declare module '@exweiv/easy-auth' {
    type AuthResponse = { [key: string]: any };

    namespace Facebook {
        type RedirectURLOptions = {
            redirect_uri: string,
            client_id: string,
            response_type?: string[],
            scope?: string[],
            state?: string,
        }

        type AuthOptions = {
            client_id: string,
            client_secret?: string,
            redirect_uri: string,
            code?: string,
            fields?: string[]
        }
    }

    interface facebook {
        /**
         * Creates a redirect url for authenticating user via Facebook
         * 
         * @param options Options that's used when creating redirect url.
         */
        redirectURL(options: Facebook.RedirectURLOptions): string;

        /**
         * Gets user data from Facebook
         * 
         * @param options Options that's used when getting user data from Facebook.
         * @param getClientSecret Defaults to true when set to false you can pass your own client_secret when set to true API will try to fetch client_secret from Wix Secrets Manager, create a secret with `FacebookClientSecret` name.
         * @param access_token Defaults to undefined, when you pass a access_token this access_token will be used when getting user data. Otherwise API will generate new one.
         */
        userAuth(options: Facebook.AuthOptions, getClientSecret?: boolean, access_token?: string): Promise<AuthResponse>;
    }

    namespace Google {
        type RedirectURLOptions = {
            redirect_uri: string,
            client_id: string,
            response_type?: string,
            scope?: string[],
            state?: string,
            prompt?: string,
            access_type?: string
        }

        type AuthOptions = {
            client_id: string,
            client_secret?: string,
            redirect_uri: string,
            code: string,
            grant_type?: string
        }

        type Tokens = {
            id_token: string,
            access_token: string
        }
    }

    interface google {
        /**
         * Creates a redirect url for authenticating user via Google
         * 
         * @param options Options that's used when creating redirect url.
         */
        redirectURL(options: Google.RedirectURLOptions): string;

        /**
         * Gets user data from Google
         * 
         * @param options Options that's used when getting user data from Google.
         * @param getClientSecret Defaults to true when set to false you can pass your own client_secret when set to true API will try to fetch client_secret from Wix Secrets Manager, create a secret with `GoogleClientSecret` name.
         * @param tokens Defaults to undefined, optionally you can pass the access_token and id_token to be used directly when making calls to Google APIs.
         */
        userAuth(options: Google.AuthOptions, getClientSecret?: boolean, tokens?: Google.Tokens): Promise<AuthResponse>;
    }
}