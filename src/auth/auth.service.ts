import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // Find the user by email
    const user = await this.usersService.user({ email });
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    // Verify the password
    const passwordMatches = await bcrypt.compare(
      password,
      String(user.password),
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload and sign token
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '90d',
    });

    // 4️⃣ Return the token
    return { access_token: accessToken };
  }
}
