import { Module } from '@nestjs/common';
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}
  async getForApplication(applicationId: string) {
    return this.prisma.document.findMany({ where: { applicationId, isDeleted: false } });
  }
  async prevalidate(applicationId: string) {
    const docs = await this.prisma.document.findMany({ where: { applicationId, isDeleted: false } });
    return { canSubmit: docs.length > 0, missing: [], issues: [], readinessImpact: 0, docs };
  }
  async verify(id: string, userId: string, status: string, remarks?: string) {
    return this.prisma.document.update({
      where: { id },
      data: { verificationStatus: status as any, verifiedById: userId, verifiedAt: new Date(), verificationRemarks: remarks },
    });
  }
  async upload(applicationId: string, data: any) {
    return this.prisma.document.create({
      data: {
        applicationId,
        docCode: data.docCode || 'GENERAL_DOC',
        docName: data.docName || 'Uploaded Document',
        fileUrl: data.fileUrl || 'https://maitrisetu.maharashtra.gov.in/docs/sample.pdf',
        mimeType: data.mimeType || 'application/pdf',
        fileSize: data.fileSize || 102400,
        status: 'UPLOADED',
        verificationStatus: 'UNVERIFIED',
      },
    });
  }
}

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}
  @Post('prevalidate-application/:appId')
  prevalidate(@Param('appId') id: string) { return this.svc.prevalidate(id); }
  @Get('application/:appId')
  getForApp(@Param('appId') id: string) { return this.svc.getForApplication(id); }
  @Post('upload/:appId')
  upload(@Param('appId') id: string, @Body() body: any) { return this.svc.upload(id, body); }
  @Post(':id/verify')
  verify(@Param('id') id: string, @Body() body: any) { return this.svc.verify(id, body.userId, body.status, body.remarks); }
}

@Module({ controllers: [DocumentsController], providers: [DocumentsService], exports: [DocumentsService] })
export class DocumentsModule {}
