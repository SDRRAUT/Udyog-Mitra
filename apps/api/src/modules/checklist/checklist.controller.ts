import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectData } from './rule-engine.service';

@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateChecklist(@Body() projectData: ProjectData) {
    return this.checklistService.generateChecklist(projectData);
  }

  @Get('rules')
  @UseGuards(JwtAuthGuard)
  async getRules(@Query('isActive') isActive?: string) {
    return this.checklistService.getRules(
      isActive !== undefined ? { isActive: isActive === 'true' } : undefined,
    );
  }
}
