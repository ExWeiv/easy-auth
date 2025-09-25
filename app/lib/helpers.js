"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyOwnPropsOnly = void 0;
function copyOwnPropsOnly(src) {
    const result = Object.create(null);
    function copyObject(value) {
        if (isPlainObject(value)) {
            return copyOwnPropsOnly(value);
        }
        else {
            return value;
        }
    }
    for (const key of Object.getOwnPropertyNames(src)) {
        if (key !== "__proto__" || "constructor" || "prototype") {
            if (typeof src[key] === "object") {
                result[key] = copyObject(src[key]);
            }
            else {
                result[key] = src[key];
            }
        }
    }
    return result;
}
exports.copyOwnPropsOnly = copyOwnPropsOnly;
function isPlainObject(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    if (Array.isArray(value))
        return false;
    return value.constructor === Object;
}
