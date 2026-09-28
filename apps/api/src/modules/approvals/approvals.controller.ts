import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get(['approvals/queue/dept', 'application-approvals/queue', 'approvals/queue'])
  getDeptQueue(@Req() req: any, @Query() query: any) {
    const departmentId = req.user?.departmentId || query?.departmentId;
    return this.approvalsService.getDeptQueue(departmentId, query);
  }

  @Patch('application-approvals/:id/status')
  updateStatus(@Param('id') id: string, @Req() req: any, @Body() body: { action: string; remarks?: string }) {
    return this.approvalsService.updateStatus(id, req.user.id, req.user.departmentId, body.action, body.remarks);
  }

  @Post('application-approvals/:id/queries')
  raiseQuery(@Param('id') id: string, @Req() req: any, @Body() body: { queryText: string; attachmentUrls?: string[] }) {
    return this.approvalsService.raiseQuery(id, req.user.id, body.queryText, body.attachmentUrls);
  }

  @Post('application-approvals/:id/queries/:qid/reply')
  replyQuery(@Param('qid') qid: string, @Req() req: any, @Body() body: { replyText: string; attachmentUrls?: string[] }) {
    return this.approvalsService.replyQuery(qid, req.user.id, body.replyText, body.attachmentUrls);
  }

  @Get('application-approvals/:id/queries')
  getQueries(@Param('id') id: string) {
    return this.approvalsService.getQueriesForApproval(id);
  }

  @Post('application-approvals/:id/approve')
  approve(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.approvalsService.updateStatus(id, req.user.id, req.user.departmentId, 'approve', body.remarks);
  }

  @Post('application-approvals/:id/reject')
  reject(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.approvalsService.updateStatus(id, req.user.id, req.user.departmentId, 'reject', body.remarks);
  }

  @Post('application-approvals/:id/return')
  return(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.approvalsService.updateStatus(id, req.user.id, req.user.departmentId, 'return', body.remarks);
  }

  @Post('application-approvals/:id/recommend')
  recommend(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.approvalsService.updateStatus(id, req.user.id, req.user.departmentId, 'recommend', body.remarks);
  }
}
