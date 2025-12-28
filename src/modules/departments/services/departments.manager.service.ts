import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Department } from "../entities/department.entity";
import { Repository } from "typeorm";
import { CreateDepartmentDto } from "../dto/create-department.dto";
import { UpdateDepartmentDto } from "../dto/update-department.dto";


@Injectable()
export class DepartmentsManagerService {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>
    ) {}

    // create new Department
    async create(payload: CreateDepartmentDto): Promise<Department> {
        const department = this.departmentRepository.create(payload)
        return await this.departmentRepository.save(department)
    }

    // findAll Departments
    async findAll(): Promise<Department[]> {
        return await this.departmentRepository.find({
            order: { createdAt: 'DESC'}
        });
    }

    // findOne Department
    async findOne(id: number): Promise<Department> {
        const department = await this.departmentRepository.findOne({ where: { id }})
        if (!department) {
            throw new NotFoundException(`Department with id: ${id} not found`);
        }
        return department;
    }

    // update department
    async update(id: number, payload: UpdateDepartmentDto): Promise<Department> {
        const department = await this.findOne(id);
        const merged = this.departmentRepository.merge(department, payload);
        return await this.departmentRepository.save(merged);
    }

    // remove Department 
    async remove(id: number): Promise<void> {
        const department = await this.findOne(id);
        await this.departmentRepository.remove(department);
    }
}