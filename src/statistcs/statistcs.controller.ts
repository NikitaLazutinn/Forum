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
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('entity') entity: string,
    @Query('partition') partition: string,
    @Req() request,
  ) {
    const date1 = new Date(Date.parse(startDate + 'T00:00:00.560Z'));
    const date2 = new Date(Date.parse(endDate + 'T00:00:00.560Z'));
    const token_data = request.user;

    const effectiveUserId = userId || token_data.id;

    if (!(startDate && endDate) && !entity) {
      throw new BadRequestException('Interval and entity type are required');
    }

    const statistics = await this.statisticsService.fetchStatistics(
      +effectiveUserId,
      date1,
      date2,
      entity,
      partition,
      token_data,
    );

    return {
      userId: effectiveUserId,
      startDate,
      endDate,
      entity,
      partition,
      statistics,
    };
  }
}
