import facebookAPIs from './Facebook/facebook';
import googleAPIs from './Google/google';
import githubAPIs from './GitHub/github';

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

export default {
    facebook,
    google,
    github
}