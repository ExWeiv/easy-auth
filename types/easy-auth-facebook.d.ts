/**
 * Easy Auth is a package to let you integrate some popular OAuth providers with `wix-members` platform in your Wix powered web application.
 * This NPM package is not designed for basic users or basic use cases it's more about having the control of everything and being able to customize most of the things.
 * 
 * If you need something basic then you should install the Easy Auth application from Wix App Market and use pre-built widgets with your own setup.
 */
declare module '@exweiv/easy-auth' {
    function facebookRedirectURL(options: FacebookRedirectURLOptions): string;

    function facebookUserAuth(options: FacebookAuthOptions, getClientSecret?: boolean): Promise<FacebookAuthResponse>;

    type FacebookRedirectURLOptions = {
        redirect_uri: string,
        client_id: string,
        response_type: string,
        scope: string,
        state: string,
    }

    type FacebookAuthOptions = {
        client_id: string,
        client_secret?: string,
        redirect_uri: string,
        code: string,
        fields: string
    }

    type FacebookAuthResponse = { [key: string]: any };
}