/**
 * Easy Auth is a package to let you integrate some popular OAuth providers with `wix-members` platform in your Wix powered web application.
 * This NPM package is not designed for basic users or basic use cases it's more about having the control of everything and being able to customize most of the things.
 * 
 * If you need something basic then you should install the Easy Auth application from Wix App Market and use pre-built widgets with your own setup.
 */
declare module '@exweiv/easy-auth' {
    type AuthResponse = { [key: string]: any };

    /**
    * Read Facebook Docs for more info about anything here.
    */
    namespace facebook {
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

        /**
         * Creates a redirect url for authenticating user via Facebook
         * 
         * @param options Options that's used when creating redirect url.
         */
        function redirectURL(options: RedirectURLOptions): string;

        /**
         * Gets user data from Facebook
         * 
         * @param options Options that's used when getting user data from Facebook.
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `FacebookClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        function authUser(options: AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to Facebook. Keep in mind Facebook has a different system for tokens. Facebook doesn't have any refresh_tokens instead you exhcnage expired tokens with new ones.
         * 
         * @param options Options that's used when getting tokens from Facebook
         */
        function getTokens(options: TokensOptions): Promise<TokensResponse>;
    }

    /**
    * Read Google Docs for more info about anything here.
    */
    namespace google {
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

        /**
         * Creates a redirect url for authenticating user via Google
         * 
         * @param options Options that's used when creating redirect url.
         */
        function redirectURL(options: RedirectURLOptions): string;

        /**
         * Gets user data from Google
         * 
         * @param options Options that's used when getting user data from Google.
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `GoogleClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        function authUser(options: AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to Google. You can refresh expired tokens using refresh tokens.
         * 
         * @param options Options that's used when getting tokens from Google
         */
        function getTokens(options: TokensOptions): Promise<TokensResponse>;
    }

    /**
    * Read GitHub Docs for more info about anything here.
    */
    namespace github {
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

        /**
        * Creates a redirect url for authenticating user via GitHub
        * 
        * @param options Options that's used when creating redirect url.
        */
        function redirectURL(options: RedirectURLOptions): string;

        /**
         * Gets user data from GitHub
         * 
         * @param options Options that's used when getting user data from GitHub.
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `GitHubClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        function authUser(options: AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to GitHub. You can refresh expired tokens using refresh tokens.
         * 
         * @param options Options that's used when getting tokens from GitHub
         */
        function getTokens(options: TokensOptions): Promise<TokensResponse>;
    }

    /**
    * Read Discord Docs for more info about anything here.
    */
    namespace discord {
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

        /**
             * Creates a redirect url for authenticating user via Discord
             * 
             * @param options Options that's used when creating redirect url.
             */
        function redirectURL(options: RedirectURLOptions): string;

        /**
         * Gets user data from Discord
         * 
         * @param options Options that's used when getting user data from Discord.
         * @param client_secret Defaults to undefined, if you don't pass a client_secret API will use Wix Secret Manager to find client_secret named as `DiscordClientSecret`.
         * @param access_token Defaults to undefined, if you don't pass a access_token API will get new one each time.
         */
        function userAuth(options: AuthOptions, client_secret?: string, access_token?: string): Promise<AuthResponse>;

        /**
         * Gets tokens for API calls to Discord. You can refresh expired tokens using refresh tokens.
         * 
         * @param options Options that's used when getting tokens from Discord
         */
        function getTokens(options: TokensOptions): Promise<TokensResponse>;
    }

    /**
    * Steam itself doesn't provide any OAuth 2.0 or something similar to authenticate users with their APIs. You'll need to implement a secure way to authenticate users via Steam.
    * This isn't a realy OAuth 2.0 method since you won't get any access_token after user sign-in to Steam, what you'll get is users's public Steam ID (number).
    * That you can use to get public info of that user after successful login.
    */
    namespace steam {
        type RedirectURLOptions = {
            realm: string,
            redirect_uri: string,
            state?: string
        }

        type AuthOptions = {
            steamId: string
        }


        /**
        * Creates a redirect url for authenticating user via Steam
        * 
        * @param options Options that's used when creating redirect url.
        */
        function redirectURL(options: RedirectURLOptions): string;

        /**
         * Gets user data from Steam
         * 
         * @param options Options that's used when getting user data from Steam.
         * @param client_secret Defaults to undefined, if you don't pass a client_secret (apiKey) API will use Wix Secret Manager to find client_secret named as `SteamClientSecret`.
         */
        function userAuth(options: AuthOptions, client_secret?: string): Promise<AuthResponse>;
    }

    /**
    * Helper functions to quickly integrate OAuth providers with Wix Members in backend 
    */
    namespace oauth {
        type OAuthProviders = "google" | "facebook" | "discord" | "github";
        type OAuthOptions = google.AuthOptions & facebook.AuthOptions & discord.AuthOptions & github.AuthOptions;

        /**
         * This function handles the user authentication and returns a session token to be used in the frontend with wix-members-frontend APIs.
         * 
         * @param provider Provider you want to use for the process (This function currently does not support Steam)
         * @param options authUser options for the process related options based on the provider
         */
        function getSessionToken(provider: OAuthProviders, options: OAuthOptions): Promise<string>;
    }

    // type Providers = "google" | "facebook" | "discord" | "steam" | "github";
    // type ProvidersList = Providers[];
}