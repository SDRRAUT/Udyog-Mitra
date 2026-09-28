import { Controller, Post, Get, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}
  @Post() create(@Body() body: any) { return this.inspectionsService.create(body); }
  @Post('joint') createJoint(@Body() body: any) { return this.inspectionsService.createJoint(body); }
  @Get() getAll(@Req() req: any) { return this.inspectionsService.getAll({ departmentId: req.user.departmentId }); }
  @Patch(':id/complete') complete(@Param('id') id: string, @Body() body: any) { return this.inspectionsService.complete(id, body.reportUrl, body.notes); }
}
