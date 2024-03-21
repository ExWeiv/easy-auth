"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebook = void 0;
const facebook_1 = require("./Facebook/facebook");
exports.facebook = {
    userAuth: facebook_1.userAuth,
    redirectURL: facebook_1.redirectURL
};
exports.default = {
    facebook: exports.facebook
};
