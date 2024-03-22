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
            redirect_uri: string,
            code: string,
            grant_type?: string
        }

        type TokensOptions = {
            client_id: string,
            client_secret?: string,
            code: string
            grant_type?: string,
            redirect_uri: string,
            refresh_token?: string
        }

        type TokensResponse = {
            access_token: string,
            expires_in: number,
            refresh_token: string,
            scope: string,
            token_type: string
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
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `GoogleClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        authUser(options: Google.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to Google
         * 
         * @param options Options that's used when getting tokens from Google
         */
        getTokens(options: Google.TokensOptions): Promise<Google.TokensResponse>;
    }

    namespace GitHub {
        type RedirectURLOptions = {
            redirect_uri: string,
            client_id: string,
            state?: string,
            allow_signup?: boolean
        }

        type AuthOptions = {
            client_id: string,
            client_secret?: string,
            redirect_uri: string,
            code: string,
            repository_id?: string
        }
    }

    interface github {
        /**
         * Creates a redirect url for authenticating user via GitHub
         * 
         * @param options Options that's used when creating redirect url.
         */
        redirectURL(options: GitHub.RedirectURLOptions): string;

        /**
         * Gets user data from GitHub
         * 
         * @param options Options that's used when getting user data from GitHub.
         * @param getClientSecret Defaults to true when set to false you can pass your own client_secret when set to true API will try to fetch client_secret from Wix Secrets Manager, create a secret with `GitHubClientSecret` name.
         */
        userAuth(options: GitHub.AuthOptions, getClientSecret?: boolean): Promise<AuthResponse>;
    }

    namespace Discord {
        type RedirectURLOptions = {
            redirect_uri: string,
            client_id: string,
            state?: string,
            response_type?: string,
            prompt?: string,
            scope?: string[]
        }

        type AuthOptions = {
            redirect_uri: string,
            code: string,
            grant_type?: string,
            client_secret: string,
            client_id: string,
        }
    }

    interface discord {
        /**
         * Creates a redirect url for authenticating user via GitHub
         * 
         * @param options Options that's used when creating redirect url.
         */
        redirectURL(options: Discord.RedirectURLOptions): string;

        /**
         * Gets user data from Discord
         * 
         * @param options Options that's used when getting user data from Discord.
         * @param getClientSecret Defaults to true when set to false you can pass your own client_secret when set to true API will try to fetch client_secret from Wix Secrets Manager, create a secret with `DiscordClientSecret` name.
         * @param access_token Defaults to undefined, but if you want to set a saved access_token then API will use the passed token for user data call.
         */
        userAuth(options: Discord.AuthOptions, getClientSecret?: boolean, access_token?: string): Promise<AuthResponse>;
    }
}