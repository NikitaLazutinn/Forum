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
import { AuthGuardCustom } from 'src/guards';
import { CreateActionDto } from './dto/create-statistc.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @UseGuards(AuthGuardCustom)
  async getStatistics(
    @Query() query: CreateActionDto,
    @Req() request,
  ) {
    let { userId, startDate, endDate, entity, partition } = query;
    startDate = new Date(Date.parse(startDate + 'T00:00:00.560Z'));
    endDate = new Date(Date.parse(endDate + 'T00:00:00.560Z'));
    const token_data = request.user;

    userId ? 0 : (userId = token_data.id);
    userId = +userId;

    if (!(startDate && endDate) && !entity) {
      throw new BadRequestException('Interval and entity type are required');
    }
    const data = { userId, startDate, endDate, entity, partition };

    const statistics = await this.statisticsService.fetchStatistics(
      data,
      token_data,
    );

    return {
      statistics
    };
  }
}
