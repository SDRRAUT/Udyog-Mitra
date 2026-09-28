// UDYOG MARG - Root App Module
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { QueriesModule } from './modules/queries/queries.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { SchemesModule } from './modules/schemes/schemes.module';
import { AIModule } from './modules/ai/ai.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { GrievancesModule } from './modules/grievances/grievances.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { SLAModule } from './modules/sla/sla.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 1000,
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    WebsocketModule,
    AuthModule,
    UsersModule,
    ApplicationsModule,
    ChecklistModule,
    ApprovalsModule,
    DocumentsModule,
    QueriesModule,
    InspectionsModule,
    SchemesModule,
    AIModule,
    AnalyticsModule,
    GrievancesModule,
    ComplianceModule,
    NotificationsModule,
    AuditModule,
    SLAModule,
    HealthModule,
  ],
})
export class AppModule {}
