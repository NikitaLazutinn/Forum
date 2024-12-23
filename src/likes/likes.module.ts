import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LiklesController } from './likes.controller';
import { LiklesService } from './likes.service';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PostsModule)],
  controllers: [LiklesController],
  providers: [LiklesService],
  exports: [LiklesService],
})
export class LikesModule {}
