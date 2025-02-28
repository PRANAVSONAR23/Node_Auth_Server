import env from '../config/env.js';
export const logger = {
    info: (message, ...data) => {
        if (env.NODE_ENV !== 'test') {
            console.log(`[INFO] ${message}`, ...data);
        }
    },
    error: (message, ...data) => {
        if (env.NODE_ENV !== 'test') {
            console.error(`[ERROR] ${message}`, ...data);
        }
    },
    debug: (message, ...data) => {
        if (env.NODE_ENV === 'development') {
            console.debug(`[DEBUG] ${message}`, ...data);
        }
    }
};
