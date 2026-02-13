import { Module } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEmployeeController } from './controller/tasks-employee.controller';
import { TasksManagerController } from './controller/tasks-manager.controller';
import { TasksEmployeeService } from './services/tasks-employee.service';
import { TasksManagerService } from './services/task-manager.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
          TypeOrmModule.forFeature([Task, User])
      ],
  controllers: [TasksEmployeeController, TasksManagerController],
  providers: [TasksEmployeeService, TasksManagerService],
})
export class TasksModule {}
 