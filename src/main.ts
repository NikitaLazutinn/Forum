import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { randomBytes } from 'crypto';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true, // Увімкнення автоматичної трансформації
      }),
    );
  //app.useGlobalPipes(new ValidationPipe());

  // const config = new DocumentBuilder()
  //   .setTitle('API')
  //   .setVersion('1.0')
  //   .addTag('API')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  console.log('port 3000');
  await app.listen(3000);


  // const secret = randomBytes(32).toString('hex'); // Генерує випадковий 64-символьний ключ
  // console.log(secret);
}
bootstrap();
