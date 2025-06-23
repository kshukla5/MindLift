const config = require('./config');

console.log('Database host:', config.db.host);
console.log('JWT secret loaded:', typeof config.jwtSecret === 'string');
console.log('Stripe public key:', config.stripe.publicKey);
