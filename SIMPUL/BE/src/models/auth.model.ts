export type AuthRole = 'simpul' | 'lora' | 'public';

export interface AuthUserEntity {
  id: string;
  identifier: string;
  password: string;
  role: AuthRole;
  name: string;
  roleTitle: string;
  avatarUrl: string;
}

export interface AuthSessionPayload {
  userId: string;
  name: string;
  role: AuthRole;
  nipOrId: string;
  avatarUrl: string;
  roleTitle: string;
  token: string;
}
