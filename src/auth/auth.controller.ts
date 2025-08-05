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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
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
    return this.usersService.create(registerBody);
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }

  @Public()
  @Get('all')
  getAll(@Request() req: RequestWithUser) {
    return req.user;
  }
}
