import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const port = configService.get('PORT', 3001)
  const appName = configService.get('APP_NAME')

  //set global API perfix
  app.setGlobalPrefix('api/v1')

  // enable cors 
  app.enableCors({
    origin: true,
    credential: true
  })
  
  // For DTO
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true, 
  forbidNonWhitelisted: true, 
  transform: true, 
  }));

  //enable response transformation
  app.useGlobalInterceptors(new TransformResponseInterceptor)

  //Add Swagger

  //manager swagger
  const managerConfig = new DocumentBuilder()
    .setTitle('Hr API - manager routes')
    .setDescription('this route panel for manager')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const managerDocument = SwaggerModule.createDocument(app, managerConfig, {
    include: [AppModule],
    deepScanRoutes: true
  });

  SwaggerModule.setup('api/v1/manager/docs', app, managerDocument)

  await app.listen(port);
  console.log(`🔫 Application "${appName}" is running on: ${port}`)
}
bootstrap();
