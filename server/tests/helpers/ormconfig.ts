import { ConnectionOptions } from 'typeorm';

const defaultConfig = require('../../ormconfig.json');

const config: ConnectionOptions = {
  ...defaultConfig,
  name: 'memory',
  database: ':memory:',
  logging: [/*'query',*/ 'error'],
};

export default config;
