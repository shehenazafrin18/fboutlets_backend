import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // Global response interceptor
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
  );

  // Global exception filter
  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );
  const whitelist = [
    'http://localhost:3005',
    'http://localhost:3008'
  ]
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
        console.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        console.log('blocked cors for:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
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
