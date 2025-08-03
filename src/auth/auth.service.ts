import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

    // Return the token
    return { access_token: accessToken };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.user({ email });
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const transporter: Transporter<SentMessageInfo> = createTransport({
      host: this.configService.get<string>('TEST_EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('TEST_EMAIL_USER'),
        pass: this.configService.get<string>('TEST_EMAIL_PASSWORD'),
      },
    });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: user.email,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="http://localhost:3000/reset-password?token=${token}">here</a> to reset your password.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { message: 'Password reset link sent to your email' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.user({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updateUser({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Password has been reset successfully' };
  }
}
