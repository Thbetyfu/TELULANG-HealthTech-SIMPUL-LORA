/**
 * Shared FE→BE base URL for the unified Vite SPA and imported SIMPUL/LORA views.
 * Set VITE_API_BASE_URL in `.env` (see `.env.example`). Default: local Express on :5000.
 */
const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const API_BASE_URL = (rawBase?.replace(/\/$/, '') || 'http://localhost:5000');

export const apiUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
};
