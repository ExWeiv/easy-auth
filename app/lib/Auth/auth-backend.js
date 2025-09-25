"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionToken = void 0;
const errors_1 = require("../Errors/errors");
const wix_members_backend_1 = require("wix-members-backend");
const providers = __importStar(require("../index"));
async function getSessionToken(provider, options, access_token) {
    try {
        const response = await providers[provider].authUser(options, undefined, access_token);
        const email = response.email;
        const sessionToken = await wix_members_backend_1.authentication.generateSessionToken(email);
        return sessionToken;
    }
    catch (err) {
        throw Error(`${errors_1.prefix} ${provider} - failed to login member with email.`);
    }
}
exports.getSessionToken = getSessionToken;
