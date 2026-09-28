import { Controller, Post, Get, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.applicationsService.createDraft(
      req.user.id,
      body.districtId || req.user.districtId,
      body,
    );
  }

  @Get()
  async findAll(@Req() req: any, @Query() query: any) {
    return this.applicationsService.getApplications(
      req.user.id,
      req.user.role,
      req.user.departmentId,
      query,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.applicationsService.getApplicationById(
      id,
      req.user.id,
      req.user.role,
      req.user.departmentId,
    );
  }

  @Get(':id/caf-data')
  async getCAFData(@Param('id') id: string) {
    return this.applicationsService.getCAFData(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.applicationsService.updateDraft(id, req.user.id, body);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Req() req: any) {
    return this.applicationsService.submitApplication(id, req.user.id);
  }

  @Delete(':id/draft')
  async deleteDraft(@Param('id') id: string, @Req() req: any) {
    // soft delete
    return { message: 'Draft deleted' };
  }
}
