
// Polyfill global objects needed by discord.js
(window as any).global = window;
(window as any).process = {
  env: {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    NODE_ENV: process.env.NODE_ENV
  },
  version: 'v16.0.0',
  versions: {
    node: '16.0.0'
  },
  platform: 'browser'
};

// Mock util.debuglog since it's not needed in browser environment
(window as any).util = {
  debuglog: () => () => {},
  types: {
    isDate: (obj: any) => obj instanceof Date,
    isRegExp: (obj: any) => obj instanceof RegExp
  }
};

// Polyfill other Node.js built-ins that discord.js might need
(window as any).Buffer = {
  isBuffer: () => false
};
