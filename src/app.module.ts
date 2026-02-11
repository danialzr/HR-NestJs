import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from './modules/departments/departments.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { AttendanceModule } from './modules/attendances/attendance.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // configModule for get env variable data.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    // connect to database with typeorm
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', ''),
        database: configService.get('DB_NAME', 'hr_db'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') == 'true',
        logging: false
      }),
      inject: [ConfigService]
    }),

    // Imports project module 
    AuthModule,
    DepartmentsModule,
    AttendanceModule,
    PayrollModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule { }
