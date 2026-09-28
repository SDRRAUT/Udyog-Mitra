import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: any) {
    return this.prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true, name: true, email: true, mobile: true, role: true,
        isActive: true, isVerified: true, lastActive: true,
        department: { select: { name: true, code: true } },
        district: { select: { name: true } },
        departmentId: true, districtId: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { department: true, district: true, entrepreneurProfile: true },
    });
  }

  async updateProfile(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
