import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { RuleEngineService } from './rule-engine.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService, RuleEngineService],
  exports: [ChecklistService, RuleEngineService],
})
export class ChecklistModule {}
