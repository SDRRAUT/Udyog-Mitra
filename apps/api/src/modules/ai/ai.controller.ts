import { Controller, Post, Get, Body, Req, UseGuards, Query } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(
    @Req() req: any,
    @Body() body: { query: string; applicationId?: string; language?: string },
  ) {
    return this.aiService.chat(body.query, req.user.id, body.applicationId, body.language || 'auto');
  }

  @Post('ingest-knowledge')
  @UseGuards(JwtAuthGuard)
  async ingestKnowledge(@Body() body: any) {
    return this.aiService.ingestKnowledge(body);
  }

  @Get('health')
  async getHealth() {
    return this.aiService.getHealth();
  }
}
