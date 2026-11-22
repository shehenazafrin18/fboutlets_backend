import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);

  app.enableCors({
    origin: [
      'http://localhost:3005',
      'http://localhost:3008',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('NestJS + Sequelize Authentication API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
