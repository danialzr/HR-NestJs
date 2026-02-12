import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavesManagerController } from './controller/leaves-manager.controller';
import { LeaveEmployeeController } from './controller/leaves-employee.controller';
import { LeaveEmployeeService } from './services/leaves-employee.service';
import { LeavesManagerService } from './services/leaves-manager.service';
import { Leave } from './entities/leave.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Leave]),
  ],
  controllers: [LeaveEmployeeController, LeavesManagerController],
  providers: [LeaveEmployeeService, LeavesManagerService],
})
export class LeavesModule { }
