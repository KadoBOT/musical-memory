import path from 'path'

import { version } from '../package.json'

const config = {
  version,
  debug: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 7001
};

export default config;
