// Frontend API base URL helper
// Uses REACT_APP_API_URL if provided; otherwise relies on same-origin `/api` via Vercel rewrites

const API_URL = process.env.REACT_APP_API_URL || '';

export default API_URL;

