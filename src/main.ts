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

  if (managerDocument.paths) {
    Object.keys(managerDocument.paths).forEach((path) => {
      if (!path.includes('/manager') && !path.includes('/auth')) {
        delete managerDocument.paths[path];
      }
    })
  }

  SwaggerModule.setup('api/v1/manager/docs', app, managerDocument)

  //employee swagger
  const employeeConfig = new DocumentBuilder()
    .setTitle('Hr API - employee routes')
    .setDescription('this route panel for employee')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const employeeDocument = SwaggerModule.createDocument(app, employeeConfig, {
    include: [AppModule],
    deepScanRoutes: true
  });

  if (employeeDocument.paths) {
    Object.keys(employeeDocument.paths).forEach((path) => {
      if (!path.includes('/employee') && !path.includes('/auth')) {
        delete employeeDocument.paths[path];
      }
    })
  }

  SwaggerModule.setup('api/v1/employee/docs', app, employeeDocument)

  await app.listen(port);
  console.log(`🔫 Application "${appName}" is running on: ${port}`)
}
bootstrap();
