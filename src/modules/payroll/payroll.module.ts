import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payroll } from "./entities/payroll.entity";
import { User } from "../users/entities/user.entity";
import { PayrollManagerController } from "./controllers/payroll-manager.controller";
import { PayrollManagerService } from "./services/payroll-manager.service";
import { PayrollEmployeeController } from "./controllers/payroll-employee.controller";
import { PayrollEmployeeService } from "./services/payroll-employee.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Payroll, User])
    ],
    controllers: [
        PayrollManagerController, PayrollEmployeeController
    ],
    providers: [
        PayrollManagerService, PayrollEmployeeService
    ]
})
export class PayrollModule {}