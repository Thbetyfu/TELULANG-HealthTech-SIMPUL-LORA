/**
 * Shared FE→BE base URL for the unified Vite SPA and imported SIMPUL/LORA views.
 * Set VITE_API_BASE_URL in `.env` (see `.env.example`).
 * In production (e.g. Vercel deployment without custom VITE_API_BASE_URL),
 * it uses same-origin relative URLs (`/api/...`) so Vercel Serverless Function executes backend routes.
 * In local dev, it defaults to Express backend at http://localhost:5000.
 */
const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const getApiBaseUrl = (): string => {
  if (rawBase && rawBase.trim() !== '') {
    return rawBase.replace(/\/$/, '');
  }
  if (
    typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBaseUrl();
  return `${base}${normalized}`;
};
