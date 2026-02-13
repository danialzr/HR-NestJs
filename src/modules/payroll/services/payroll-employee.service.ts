import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payroll } from "../entities/payroll.entity";
import { Repository } from "typeorm";

@Injectable()
export class PayrollEmployeeService {
    constructor(
        @InjectRepository(Payroll)
        private readonly payrollRepo: Repository<Payroll>
    ) {}

    async findAllMyPayrolls(userId: number) {
        return await this.payrollRepo.find({
            where: { user: { id: userId } },
            order: { salaryPeriod: 'DESC' }
        });
    }

    async findOneMyPayroll(id: number, userId: number) {
        const payroll = await this.payrollRepo.findOne({
            where: { id, user: { id: userId } }
        });
        if (!payroll) throw new NotFoundException('فیش حقوقی یافت نشد');
        return payroll;
    }
}