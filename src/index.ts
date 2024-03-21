import facebookAPIs from './Facebook/facebook';
import googleAPIs from './Google/google';

export const facebook = {
    redirectURL: facebookAPIs.redirectURL,
    userAuth: facebookAPIs.userAuth
};

export const google = {
    redirectURL: googleAPIs.redirectURL,
    userAuth: googleAPIs.userAuth
}

export default {
    facebook,
    google
}