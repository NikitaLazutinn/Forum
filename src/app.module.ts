import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
//import { Links, LinksSchema } from './schemas/Links.schema';
import { AppService } from './app.service';

@Module({
  imports: [],

  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
