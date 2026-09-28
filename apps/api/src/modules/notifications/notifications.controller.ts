import { Controller, Get, Patch, Param, Req, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAll(@Req() req: any, @Query() query: any) {
    return this.notificationsService.getForUser(req.user.id, {
      isRead: query.isRead !== undefined ? query.isRead === 'true' : undefined,
      limit: query.limit ? parseInt(query.limit) : 30,
      offset: query.offset ? parseInt(query.offset) : 0,
    });
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.markRead(id, req.user.id);
  }

  @Patch('read-all')
  async markAllRead(@Req() req: any) {
    return this.notificationsService.markAllRead(req.user.id);
  }
}
