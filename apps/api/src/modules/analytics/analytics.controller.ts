import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Public endpoint for zero-login live dashboard & landing page
  @Get('live-kpis')
  async getLiveKPIs() {
    return this.analyticsService.getLiveKPIs();
  }

  @Get('state')
  @UseGuards(JwtAuthGuard)
  async getStateAnalytics() {
    return this.analyticsService.getStateAnalytics();
  }

  @Get('district/:districtId')
  @UseGuards(JwtAuthGuard)
  async getDistrictAnalytics(@Param('districtId') districtId: string) {
    return this.analyticsService.getDistrictAnalytics(districtId);
  }

  @Get('department/:deptId')
  @UseGuards(JwtAuthGuard)
  async getDeptAnalytics(@Param('deptId') deptId: string) {
    return this.analyticsService.getDeptAnalytics(deptId);
  }
}
