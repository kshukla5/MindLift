// Centralized JWT secret resolution to keep signing and verification consistent
// Prefer environment variable; provide a safe fallback for local dev/tests

function getJwtSecret() {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.trim().length > 0) return envSecret;
  // Fallback used only when no env var is provided (e.g., local dev/tests)
  return 'mindlift-local-dev-secret';
}

module.exports = { getJwtSecret };

