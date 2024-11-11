import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    PostsModule,
    CategoriesModule,
    CommentsModule,
    LikesModule,
  ],
})
export class AppModule {}
