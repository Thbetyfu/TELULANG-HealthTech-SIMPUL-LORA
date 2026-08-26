import { AuthUserEntity } from '../models/auth.model';

/**
 * In-memory seed users for demo JWT login (Prioritas A).
 * Passwords are intentional demo credentials — replace with hashed store in Prioritas B.
 */
export class AuthRepository {
  private readonly users: AuthUserEntity[] = [
    {
      id: 'USR-SIMPUL-001',
      identifier: '19850412 201001 2 004',
      password: 'simpul123',
      role: 'simpul',
      name: 'apt. Dra. Rahmawati, M.Farm',
      roleTitle: 'Dinas Kesehatan & Apoteker (SIMPUL)',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'USR-LORA-882',
      identifier: 'LORA-KURIR-882',
      password: 'lora123',
      role: 'lora',
      name: 'Budi Santoso (Kurir LORA)',
      roleTitle: 'Kurir Logistik Rakyat (LORA PWA)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'USR-PUBLIC-001',
      identifier: 'PUBLIC-GUEST',
      password: '',
      role: 'public',
      name: 'Masyarakat Umum (Publik)',
      roleTitle: 'Masyarakat Umum (Publik)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  ];

  async findByIdentifierAndRole(
    identifier: string,
    role: AuthUserEntity['role']
  ): Promise<AuthUserEntity | null> {
    const normalized = identifier.trim().toLowerCase();
    const found = this.users.find(
      (u) => u.role === role && u.identifier.trim().toLowerCase() === normalized
    );
    return found ?? null;
  }

  async findPublicGuest(): Promise<AuthUserEntity> {
    return this.users.find((u) => u.role === 'public')!;
  }
}
