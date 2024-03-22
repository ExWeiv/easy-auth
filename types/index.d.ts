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
            redirect_uri: string,
            code?: string,
            fields?: string[]
        }

        type TokensOptions = {
            client_id: string,
            client_secret: string,
            grant_type?: string,
            redirect_uri?: string,
            code?: string,
            fb_exchange_token?: string
        }

        type TokensResponse = {
            access_token: string,
            token_type: string,
            expires_in: number
        }
    }

    /**
     * Read Facebook Docs for more info about anything here.
     */
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
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `FacebookClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        authUser(options: Facebook.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to Facebook. Keep in mind Facebook has a different system for tokens. Facebook doesn't have any refresh_tokens instead you exhcnage expired tokens with new ones.
         * 
         * @param options Options that's used when getting tokens from Facebook
         */
        getTokens(options: Facebook.TokensOptions): Promise<Facebook.TokensResponse>;
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

    /**
     * Read Google Docs for more info about anything here.
     */
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
         * Gets tokens for API calls to Google. You can refresh expired tokens using refresh tokens.
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
            redirect_uri: string,
            code: string,
            repository_id?: string
        }

        type TokensOptions = {
            client_id: string,
            client_secret: string,
            code?: string,
            redirect_uri?: string,
            repository_id?: string,
            grant_type?: string,
            refresh_token?: string
        }

        type TokensResponse = {
            access_token: string,
            expires_in: number,
            refresh_token: string,
            refresh_token_expires_in: number,
            scope: string,
            token_type: string
        }
    }

    /**
     * Read GitHub Docs for more info about anything here.
     */
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
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `GitHubClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        authUser(options: GitHub.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to GitHub. You can refresh expired tokens using refresh tokens.
         * 
         * @param options Options that's used when getting tokens from GitHub
         */
        getTokens(options: GitHub.TokensOptions): Promise<GitHub.TokensResponse>;
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
            client_id: string,
        }

        type TokensOptions = {
            client_secret: string,
            client_id: string,
            grant_type?: string,
            redirect_uri?: string,
            code?: string,
            refresh_token?: string
        }

        type TokensResponse = {
            access_token: string,
            token_type: string,
            expires_in: number,
            scope: string,
            refresh_token: string
        }
    }

    /**
     * Read Discord Docs for more info about anything here.
     */
    interface discord {
        /**
         * Creates a redirect url for authenticating user via Discord
         * 
         * @param options Options that's used when creating redirect url.
         */
        redirectURL(options: Discord.RedirectURLOptions): string;

        /**
         * Gets user data from Discord
         * 
         * @param options Options that's used when getting user data from Discord.
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `DiscordClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        userAuth(options: Discord.AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to Discord. You can refresh expired tokens using refresh tokens.
         * 
         * @param options Options that's used when getting tokens from Discord
         */
        getTokens(options: Discord.TokensOptions): Promise<Discord.TokensResponse>;
    }
}