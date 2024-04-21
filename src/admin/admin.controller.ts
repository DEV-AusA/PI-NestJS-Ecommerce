import { Controller, Body, Put, UseGuards, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/create-admin.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('Admin')
@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put()
  createAdminUser(@Body() createAdminDto: AdminDto) {
    return this.adminService.createAdminUser(createAdminDto);
  }

  @Delete()
  deleteAdminUser(@Body() deleteAdminUser: AdminDto) {
    return this.adminService.deleteAdminUser(deleteAdminUser);
  }

}
