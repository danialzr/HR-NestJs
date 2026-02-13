import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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
    ) { }

    // create new Department
    async create(payload: CreateDepartmentDto): Promise<Department> {
        const department = this.departmentRepository.create(payload)
        return await this.departmentRepository.save(department)
    }

    // findAll Departments
    async findAll(): Promise<Department[]> {
        return await this.departmentRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    // findOne Department
    async findOne(id: number): Promise<Department> {
        const department = await this.departmentRepository.findOne({ where: { id } })
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
    async remove(id: number) {
        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['users']
        });

        if (!department) throw new NotFoundException(`دپارتمان با آیدی ${id} پیدا نشد`);

        if (department.users?.length > 0) {
            throw new BadRequestException('این دپارتمان کارمند فعال دارد و قابل حذف نیست');
        }

        await this.departmentRepository.remove(department);
        return { message: 'حذف با موفقیت انجام شد', success: true };
    }

    // assign employee
    async assignUsersToDepartment(departmentId: number, userId: number | string) {
        const targetUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

        if (isNaN(targetUserId)) {
            throw new BadRequestException('آیدی کاربر معتبر نیست');
        }

        const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
        if (!department) throw new NotFoundException('دپارتمان مورد نظر یافت نشد');

        await this.departmentRepository
            .createQueryBuilder()
            .update('users') // اسم جدول یوزرها
            .set({ department: { id: departmentId } })
            .where("id = :userId", { userId: targetUserId })
            .execute();

        return {
            success: true,
            message: ` کاربر با موفقیت به دپارتمان ${department.name} منتقل شدند`
        };
    }
}