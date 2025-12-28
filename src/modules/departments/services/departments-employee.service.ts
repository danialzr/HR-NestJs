import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Department } from "../entities/department.entity";
import { Repository } from "typeorm";


@Injectable()
export class DepartmentsEmployeeService {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
    ) { }

    // findAll Departments
    async findAll(): Promise<Department[]> {
        return await this.departmentRepository.find({
            order: { name: 'ASC' }
        });
    }

    // findOnde Department
    async findOne(id: number): Promise<Department> {
        const department = await this.departmentRepository.findOne({ where: { id } })
        if (!department) {
            throw new NotFoundException(`Department with id: ${id} not found`);
        }
        return department
    }


}