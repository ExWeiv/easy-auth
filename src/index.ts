import facebookAPIs from './Facebook/facebook';
import googleAPIs from './Google/google';
import githubAPIs from './GitHub/github';
import discordAPIs from './Discord/discord';

export const facebook = {
    redirectURL: facebookAPIs.redirectURL,
    userAuth: facebookAPIs.userAuth
};

export const google = {
    redirectURL: googleAPIs.redirectURL,
    userAuth: googleAPIs.userAuth
}

export const github = {
    redirectURL: githubAPIs.redirectURL,
    userAuth: githubAPIs.userAuth
}

export const discord = {
    redirectURL: discordAPIs.redirectURL,
    userAuth: discordAPIs.userAuth
}

export default {
    facebook,
    google,
    github,
    discord
}