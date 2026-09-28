// Auth Service - OTP-based authentication
import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  // In production: use Redis or SMS gateway. For demo: store in DB
  private otpStore = new Map<string, { otp: string; expiresAt: Date; userId?: string }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async sendOTP(identifier: string): Promise<{ message: string; isNewUser: boolean }> {
    const isEmail = identifier.includes('@');
    
    // Find or check user
    const user = await this.prisma.user.findFirst({
      where: isEmail ? { email: identifier } : { mobile: identifier },
    });

    // Demo: Always use OTP 123456 for demo users, generate random for others
    const isDemoUser = user && (
      identifier.includes('@mahsetu.in') || 
      ['9000000001', '9000000002', '9000000003', '9000000004', '9000000005', '9000000006', '9000000007', '9000000008'].includes(identifier)
    );
    
    const otp = isDemoUser ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.otpStore.set(identifier, { otp, expiresAt, userId: user?.id });

    // Update user's OTP in DB for reference
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otpCode: otp, otpExpiresAt: expiresAt },
      });
    }

    // In production: send SMS/Email here
    console.log(`📱 OTP for ${identifier}: ${otp}`);

    return {
      message: isDemoUser 
        ? `Demo OTP: 123456 (for ${identifier})` 
        : `OTP sent to ${isEmail ? 'email' : 'mobile'} ending in ...${identifier.slice(-4)}`,
      isNewUser: !user,
    };
  }

  async verifyOTP(identifier: string, otp: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: any;
  }> {
    const stored = this.otpStore.get(identifier);
    
    // Demo fallback: check DB
    if (!stored) {
      const isEmail = identifier.includes('@');
      const user = await this.prisma.user.findFirst({
        where: isEmail ? { email: identifier } : { mobile: identifier },
      });
      if (!user) throw new UnauthorizedException('OTP not found or expired');
      if (user.otpCode !== otp) throw new UnauthorizedException('Invalid OTP');
      if (user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new UnauthorizedException('OTP expired');
      
      return this.generateTokensForUser(user);
    }

    if (stored.expiresAt < new Date()) {
      this.otpStore.delete(identifier);
      throw new UnauthorizedException('OTP expired');
    }

    if (stored.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    this.otpStore.delete(identifier);

    const isEmail = identifier.includes('@');
    let user = await this.prisma.user.findFirst({
      where: isEmail ? { email: identifier } : { mobile: identifier },
      include: {
        department: true,
        district: true,
        entrepreneurProfile: true,
      },
    });

    if (!user) {
      // Create new entrepreneur user
      user = await this.prisma.user.create({
        data: {
          email: isEmail ? identifier : null,
          mobile: !isEmail ? identifier : null,
          name: 'New Entrepreneur',
          role: 'ENTREPRENEUR',
          isVerified: true,
          isActive: true,
        },
        include: {
          department: true,
          district: true,
          entrepreneurProfile: true,
        },
      });
    } else {
      // Mark verified
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, lastActive: new Date(), otpCode: null, otpExpiresAt: null },
        include: {
          department: true,
          district: true,
          entrepreneurProfile: true,
        },
      });
    }

    return this.generateTokensForUser(user);
  }

  private async generateTokensForUser(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      districtId: user.districtId,
      name: user.name,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET || 'udyog-marg-secret-key-change-in-production',
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(
      { sub: user.id, type: 'refresh', jti: uuidv4() },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'udyog-marg-refresh-secret',
        expiresIn: '7d',
      },
    );

    // Store refresh token in DB
    const currentTokens = Array.isArray(user.refreshTokens) ? user.refreshTokens : [];
    const newTokens = [...currentTokens.slice(-4), { token: refreshToken, createdAt: new Date() }];
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokens: newTokens, lastActive: new Date() },
    });

    const { otpCode, otpExpiresAt, refreshTokens, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'udyog-marg-refresh-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { department: true, district: true },
      });

      if (!user || !user.isActive) throw new UnauthorizedException('User not found or inactive');

      const storedTokens = Array.isArray(user.refreshTokens) ? user.refreshTokens : [];
      const isValid = storedTokens.some((t: any) => t.token === refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      return this.generateTokensForUser(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokens: [] },
    });
  }

  async getMe(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
        district: true,
        entrepreneurProfile: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { otpCode, otpExpiresAt, refreshTokens, ...safe } = user;
    return safe;
  }
}
