import { UserRole } from '../users/users.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
