import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LiklesController } from './likes.controller';
import { LiklesService } from './likes.service';

@Module({
  imports: [PrismaModule],
  controllers: [LiklesController],
  providers: [LiklesService],
  exports: [LiklesService],
})
export class LikesModule {}
