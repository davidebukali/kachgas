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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
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
