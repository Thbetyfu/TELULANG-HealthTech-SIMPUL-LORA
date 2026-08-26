import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthSessionPayload, AuthRole } from '../models/auth.model';
import { LoginRequestInput } from '../schemas/auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'simpul-lora-demo-secret-change-me';
const JWT_EXPIRES_IN = '12h';

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async login(input: LoginRequestInput): Promise<AuthSessionPayload> {
    if (input.role === 'public') {
      const guest = await this.authRepository.findPublicGuest();
      return this.toSession(guest);
    }

    const user = await this.authRepository.findByIdentifierAndRole(
      input.identifier,
      input.role
    );

    if (!user || user.password !== (input.password ?? '')) {
      const error = new Error('Identitas atau kata sandi tidak valid untuk peran yang dipilih.') as Error & {
        statusCode?: number;
      };
      error.statusCode = 401;
      throw error;
    }

    return this.toSession(user);
  }

  private toSession(user: {
    id: string;
    name: string;
    role: AuthRole;
    identifier: string;
    avatarUrl: string;
    roleTitle: string;
  }): AuthSessionPayload {
    const token = jwt.sign(
      { sub: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      userId: user.id,
      name: user.name,
      role: user.role,
      nipOrId: user.identifier,
      avatarUrl: user.avatarUrl,
      roleTitle: user.roleTitle,
      token
    };
  }
}
