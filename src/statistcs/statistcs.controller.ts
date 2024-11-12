import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { StatisticsService } from './statistcs.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getStatistics(
    @Query('userId') userId: number,
    @Query('interval') interval: string, 
    @Query('entity') entity: string, 
    @Query('partition') partition: string, 
    @Req() request,
  ) {
    const token_data = request.user;

    const effectiveUserId = userId || token_data.id;

    if (!interval || !entity) {
      throw new BadRequestException('Interval and entity type are required');
    }

    const statistics = await this.statisticsService.fetchStatistics(
      +effectiveUserId,
      interval,
      entity,
      partition,
      token_data
    );

    return {
      userId: effectiveUserId,
      interval,
      entity,
      partition,
      statistics,
    };
  }
}
