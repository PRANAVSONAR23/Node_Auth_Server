import env from '../config/env.js';

export const logger = {
  info: (message: string, ...data: any[]) => {
    if (env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${message}`, ...data);
    }
  },
  error: (message: string, ...data: any[]) => {
    if (env.NODE_ENV !== 'test') {
      console.error(`[ERROR] ${message}`, ...data);
    }
  },
  debug: (message: string, ...data: any[]) => {
    if (env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  }
};