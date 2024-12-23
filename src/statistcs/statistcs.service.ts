import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { Dropbox } from 'dropbox';



@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async pdf(data: Record<string, any>) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const jsonContent = `
    <html>
      <body>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </body>
    </html>
  `;

    await page.setContent(jsonContent);

    const localFilePath = 'raw-json.pdf';
    await page.pdf({
      path: localFilePath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

   
    const token = process.env.DROPBOX; 
    if (!token) {
      throw new Error('Dropbox token is not set in environment variables.');
    }

    const dropbox = new Dropbox({ accessToken: token });

    const fileContent = fs.readFileSync(localFilePath);


    try {
      const response = await dropbox.filesUpload({
        path: `/${path.basename(localFilePath)}`, 
        contents: fileContent,
        mode: { '.tag': 'overwrite' },
      });

      const linkResponse = await dropbox.filesGetTemporaryLink({
        path: response.result.path_lower!,
      });

      return linkResponse.result.link;

    } catch (error) {
      
    }

   
    fs.unlinkSync(localFilePath);
  }

  async fetchStatistics(data, token_data: string) {
    const { userId, startDate, endDate, entity, partition } = data;
    if (token_data['roleId'] !== 1 && token_data['id'] !== userId) {
      throw new NotFoundException();
    }

    await this.userService.find(userId);

    if (entity === 'all') {
      try {
        const statistics = await this.aggregateAllStatistics(
          userId,
          startDate,
          endDate,
          partition,
        );
        const link = await this.pdf(statistics);
        return link;
      } catch (e) {
        throw new BadRequestException('wrong request data!');
      }
    }

    try {
      const statistics = await this.aggregateStatistics(
        userId,
        entity,
        startDate,
        endDate,
        partition,
      );

      return statistics;
    } catch (e) {
      throw new BadRequestException('wrong request data!');
    }
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

  private async aggregateAllStatistics(
    userId: number,
    startDate: Date,
    endDate: Date,
    partition: string,
  ) {
    const statistics = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const nextDate = this.calculateNextPartitionDate(currentDate, partition);
      let entityCount;

      const entities = ['Post', 'Like', 'comment', 'Views', 'Followers'];
      let count: any[] = [];
      for (const e of entities) {
        entityCount = await this.prisma[e].count({
          where: {
            userId,
            createdAt: {
              gte: currentDate,
              lt: nextDate,
            },
          },
        });
        count.push({ [e]: entityCount });
      }

      statistics.push({
        period: `${currentDate.toISOString()} - ${nextDate.toISOString()}`,
        count,
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
