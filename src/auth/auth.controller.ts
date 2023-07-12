import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './interfaces/auth-response.interface';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { SignupInput } from './dto/signup.input';
import { SigninInput } from './dto/signin.input';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupInput: SignupInput): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Post('signin')
  async signin(@Body() signinInput: SigninInput): Promise<AuthResponse> {
    return this.authService.signin(signinInput);
  }

  @Auth()
  @Get('revalidate-token')
  revalidateToken(@GetUser() user: User): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
