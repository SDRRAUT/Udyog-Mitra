import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SchemesService } from './schemes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemesService: SchemesService) {}

  @Get()
  findAll() {
    return this.schemesService.findAll();
  }

  @Get('eligibility/:applicationId')
  @UseGuards(JwtAuthGuard)
  getEligibility(@Param('applicationId') id: string) {
    return this.schemesService.getEligibility(id);
  }
}
