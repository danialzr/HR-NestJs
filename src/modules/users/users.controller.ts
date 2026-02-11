import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { User } from './entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../shared/enums/user-role.enum';

@ApiTags('Users')
@ApiBearerAuth() 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @ApiOperation({ summary: 'دریافت اطلاعات پروفایل کاربر لاگین شده' })
  async getMe(@GetUser() user: User) {
    const userData = await this.usersService.findById(user.id);
    const { password, ...result } = userData;
    return result;
  }

  @Patch('me')
  @ApiOperation({ summary: 'ویرایش پروفایل توسط خود کاربر' })
  async updateMe(@GetUser() user: User, @Body() dto: UpdateUserDto) {
    delete dto.role;
    delete dto.managerId;
    return await this.usersService.update(user.id, dto, user);
  }

  @Patch(':id')
  @Roles(Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'ویرایش کاربر توسط مدیر یا سوپرادمین' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @GetUser() currentUser: User,
  ) {
    return await this.usersService.update(id, dto, currentUser);
  }

  @Delete(':id')
  @Roles(Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'حذف کاربر بر اساس سلسله‌مراتب' })
  async removeUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() currentUser: User,
  ) {
    return await this.usersService.remove(id, currentUser);
  }
}