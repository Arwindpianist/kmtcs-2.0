/**
 * Production-safe logger utility
 * Only logs in development mode to prevent console output in production
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const noop = () => {};

const createLogger = (level: LogLevel): ((...args: unknown[]) => void) => {
  if (!isDevelopment && level !== 'error') {
    return noop;
  }

  // In development, use console methods
  if (isDevelopment) {
    return console[level].bind(console);
  }

  // In production, only allow errors (but wrap for safety)
  if (level === 'error') {
    return (...args: unknown[]) => {
      // Only log errors in production, but avoid exposing sensitive data
      const sanitized = args.map((arg) => {
        if (arg instanceof Error) {
          return {
            message: arg.message,
            stack: arg.stack,
            name: arg.name,
          };
        }
        return arg;
      });
      console.error(...sanitized);
    };
  }

  return noop;
};

export const logger: Logger = {
  log: createLogger('log'),
  info: createLogger('info'),
  warn: createLogger('warn'),
  error: createLogger('error'),
  debug: createLogger('debug'),
};

/**
 * Server-side logger (for API routes)
 */
export const serverLogger: Logger = {
  log: isDevelopment ? console.log.bind(console) : noop,
  info: isDevelopment ? console.info.bind(console) : noop,
  warn: isDevelopment ? console.warn.bind(console) : noop,
  error: console.error.bind(console), // Always log errors on server
  debug: isDevelopment ? console.debug.bind(console) : noop,
};
