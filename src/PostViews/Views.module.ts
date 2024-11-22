import { Views } from './../../node_modules/.prisma/client/index.d';
import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ViewsService } from './Views.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule)],
  controllers: [],
  providers: [ViewsService],
  exports: [ViewsService],
})
export class ViewsModule {}
