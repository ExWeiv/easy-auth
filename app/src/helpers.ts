export function copyOwnPropsOnly<R extends { [key: string]: any }>(src: R): R {
    const result = Object.create(null);

    function copyObject(value: any) {
        if (isPlainObject(value)) {
            return copyOwnPropsOnly(value); // Plain object, call recursively
        } else {
            return value; // Not a plain object, copy as-is
        }
    }

    for (const key of Object.getOwnPropertyNames(src)) {
        if (key !== "__proto__" || "constructor" || "prototype") {
            if (typeof src[key] === "object") {
                result[key] = copyObject(src[key]);
            } else {
                result[key] = src[key];
            }
        }
    }

    return result as R;
}

// Helper function to check if a value is a plain object
function isPlainObject(value: any): boolean {
    if (typeof value !== 'object' || value === null) return false;
    if (Array.isArray(value)) return false; // exclude arrays
    return value.constructor === Object;
}