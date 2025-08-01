import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestWithUser } from './types/auth.types';
import { Public } from 'src/contants';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInBody: SignInDto) {
    return this.authService.signIn(signInBody.email, signInBody.password);
  }

  @Public()
  @Post('register')
  register(@Body() registerBody: RegisterDto) {
    return this.usersService.createUser(registerBody);
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Public()
  @Get('all')
  getAll(@Request() req: RequestWithUser) {
    return req.user;
  }
}
