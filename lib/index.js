"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = exports.facebook = void 0;
const facebook_1 = __importDefault(require("./Facebook/facebook"));
const google_1 = __importDefault(require("./Google/google"));
exports.facebook = {
    redirectURL: facebook_1.default.redirectURL,
    userAuth: facebook_1.default.userAuth
};
exports.google = {
    redirectURL: google_1.default.redirectURL,
    userAuth: google_1.default.userAuth
};
exports.default = {
    facebook: exports.facebook,
    google: exports.google
};
