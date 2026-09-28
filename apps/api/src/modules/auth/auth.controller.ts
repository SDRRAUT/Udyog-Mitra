import { Controller, Post, Get, Body, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

class SendOTPDto {
  @IsString()
  identifier: string; // email or mobile
}

class VerifyOTPDto {
  @IsString()
  identifier: string;
  @IsString()
  @MinLength(6)
  otp: string;
}

class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(200)
  async sendOTP(@Body() dto: SendOTPDto) {
    return this.authService.sendOTP(dto.identifier);
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOTP(@Body() dto: VerifyOTPDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOTP(dto.identifier, dto.otp);
    
    // Set httpOnly cookie for refresh token
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refresh_token || body.refreshToken;
    if (!token) throw new Error('No refresh token');
    
    const result = await this.authService.refreshTokens(token);
    
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }
}
