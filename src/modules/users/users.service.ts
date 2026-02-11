import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/shared/enums/user-role.enum';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { mobile } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('کاربر پیدا نشد');
    return user;
  }

  async findAll(currentUser: User) {
    let users: User[] = [];

    if (currentUser.role === Role.SUPER_ADMIN) {
      users = await this.userRepository.find({
        order: { createdAt: 'DESC' },
      });
    } else if (currentUser.role === Role.MANAGER) {
      users = await this.userRepository.find({
        where: { managerId: currentUser.id },
        order: { createdAt: 'DESC' },
      });
    } else {
      throw new ForbiddenException('شما دسترسی به لیست کاربران ندارید');
    }

    return users.map(user => {
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    });
  }

  async update(id: number, dto: UpdateUserDto, currentUser: User) {
    const targetUser = await this.findById(id);

    //فقط سوپر ادمیت حق ویرایش خود را دارد
    if (targetUser.role === Role.SUPER_ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('شما اجازه ویرایش مدیر اصلی را ندارید');
    }

    //منیجر فقط میتونه زیردستای خودش رو اپدیت کنه 
    if (currentUser.role === Role.MANAGER) {
      if (targetUser.managerId !== currentUser.id) {
        throw new ForbiddenException('این کاربر تحت مدیریت شما نیست');
      }
      if (dto.role && dto.role !== Role.EMPLOYEE) {
        throw new ForbiddenException('شما نمی‌توانید نقش مدیر تعریف کنید');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
    }

    Object.assign(targetUser, dto);
    const saved = await this.userRepository.save(targetUser);
    const { password, ...result } = saved;
    return result;
  }

  async remove(id: number, currentUser: User) {
    const targetUser = await this.findById(id);

    if (targetUser.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('مدیر اصلی سیستم قابل حذف نیست');
    }

    if (currentUser.role === Role.MANAGER) {
      if (targetUser.managerId !== currentUser.id) {
        throw new ForbiddenException('شما فقط مجاز به حذف کارمندان مستقیم خود هستید');
      }

      if (targetUser.role !== Role.EMPLOYEE) {
        throw new ForbiddenException('شما اجازه حذف کاربران با نقش سطوح بالاتر را ندارید');
      }
    }

    await this.userRepository.remove(targetUser);

    return {
      message: `کاربر با آیدی ${id} با موفقیت از سیستم حذف شد`,
      success: true
    };
  }
}