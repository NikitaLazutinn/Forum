import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async fetchStatistics(
    userId: number,
    interval: string,
    entity: string,
    partition: string,
    token_data: string,
  ) {

    if (token_data['roleId'] !== 1 && token_data['id'] !== userId) {
      throw new NotFoundException();
    }

    const { startDate, endDate } = this.calculateDateRange(interval);


    const statistics = await this.aggregateStatistics(
      userId,
      entity,
      startDate,
      endDate,
      partition,
    );

    return statistics;
  }

  private calculateDateRange(interval: string) {
    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date = currentDate;

    switch (interval) {
      case 'day':
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        break;
      case 'month':
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case 'half-year':
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        break;
      default:
        throw new Error('Invalid interval');
    }

    return { startDate, endDate };
  }

  private async aggregateStatistics(
    userId: number,
    entity: string,
    startDate: Date,
    endDate: Date,
    partition: string,
  ) {

    const statistics = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const nextDate = this.calculateNextPartitionDate(currentDate, partition);

      const entityCount = await this.prisma[entity].count({
        where: {
          userId,
          createdAt: {
            gte: currentDate,
            lt: nextDate,
          },
        },
      });

      statistics.push({
        period: `${currentDate.toISOString()} - ${nextDate.toISOString()}`,
        count: entityCount,
      });

      currentDate.setTime(nextDate.getTime());
    }

    return statistics;
  }

  private calculateNextPartitionDate(
    currentDate: Date,
    partition: string,
  ): Date {
    const nextDate = new Date(currentDate);

    switch (partition) {
      case 'day':
        nextDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        nextDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        nextDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        throw new Error('Invalid partition');
    }

    return nextDate;
  }
}
