/**
 * Easy Auth is a package to let you integrate some popular OAuth providers with `wix-members` platform in your Wix powered web application.
 * This NPM package is not designed for basic users or basic use cases it's more about having the control of everything and being able to customize most of the things.
 * 
 * If you need something basic then you should install the Easy Auth application from Wix App Market and use pre-built widgets with your own setup.
 */
declare module '@exweiv/easy-auth' {
    interface facebook {
        /**
         * Creates a redirect url for authenticating user via Facebook
         * 
         * @param options Options that's used when creating redirect url.
         */
        redirectURL(options: facebook["FacebookRedirectURLOptions"]): string;

        /**
         * Gets user data from Facebook
         * 
         * @param options Options that's used when getting user data from Facebook.
         * @param getClientSecret Defaults to true when set to false you can pass your own client_secret when set to true API will try to fetch client_secret from Wix Secrets Manager, create a secret with `FacebookClientSecret` name.
         * @param access_token Defaults to undefined, when you pass a access_token this access_token will be used when getting user data. Otherwise API will generate new one.
         */
        userAuth(options: facebook["FacebookAuthOptions"], getClientSecret?: boolean, access_token?: string): Promise<facebook["FacebookAuthResponse"]>;

        FacebookRedirectURLOptions: {
            redirect_uri: string,
            client_id: string,
            response_type: string,
            scope: string,
            state: string,
        }

        FacebookAuthOptions: {
            client_id: string,
            client_secret?: string,
            redirect_uri: string,
            code: string,
            fields?: string
        }

        FacebookAuthResponse: { [key: string]: any };
    }
}