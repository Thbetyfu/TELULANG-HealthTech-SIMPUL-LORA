import { apiUrl } from '../config/api';

export type AuthRole = 'simpul' | 'lora' | 'public';

export interface UserSession {
  name: string;
  role: AuthRole;
  nipOrId: string;
  avatarUrl: string;
  roleTitle: string;
  token?: string;
  userId?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  role: AuthRole;
}

const SESSION_KEY = 'simpul_lora_session';

export function loadStoredSession(): UserSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function persistSession(session: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Thin auth client — calls Express JWT login. Easy to swap store/transport later.
 */
export async function loginWithApi(credentials: LoginCredentials): Promise<UserSession> {
  const response = await fetch(apiUrl('/api/v1/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: credentials.identifier,
      password: credentials.password,
      role: credentials.role
    })
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (json && typeof json.message === 'string' && json.message) ||
      'Login gagal. Periksa NIP/ID, kata sandi, dan peran.';
    throw new Error(message);
  }

  const data = json?.data;
  if (!data?.token || !data?.role) {
    throw new Error('Respons auth tidak valid dari server.');
  }

  return {
    name: data.name,
    role: data.role,
    nipOrId: data.nipOrId,
    avatarUrl: data.avatarUrl,
    roleTitle: data.roleTitle,
    token: data.token,
    userId: data.userId
  };
}
