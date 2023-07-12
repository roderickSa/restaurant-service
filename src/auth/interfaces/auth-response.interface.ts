import { User } from 'src/users/entities/user.entity';

export class AuthResponse {
  user: User;

  token: string;
}
