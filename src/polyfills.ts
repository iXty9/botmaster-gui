
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
