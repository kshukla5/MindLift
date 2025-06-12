const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');

// Load environment variables from .env file if it exists
if (fs.existsSync(envPath)) {
  const data = fs.readFileSync(envPath, 'utf8');
  data.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

function getEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return process.env[name];
}

function getEnvOptional(name, defaultValue = '') {
  return process.env[name] || defaultValue;
}

module.exports = {
  db: {
    host: getEnv('DB_HOST'),
    port: parseInt(getEnv('DB_PORT'), 10),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    name: getEnv('DB_NAME'),
  },
  jwtSecret: getEnv('JWT_SECRET'),
  stripe: {
    publicKey: getEnvOptional('STRIPE_PUBLIC_KEY'),
    secretKey: getEnvOptional('STRIPE_SECRET_KEY'),
  },
};
