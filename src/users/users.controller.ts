import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { FilterPasswordInterceptor } from '../interceptors/filterPassword.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindNameUserDto } from './dto/find.name.user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FilterPasswordInterceptor)
  @ApiResponse({ status: 200, description: 'Listado de usuarios completo.' })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'El usuario con el nombre ingresado no existe.',
  })
  getUsers(
    // @Query() findNameUserDto: FindNameUserDto,
    @Query('name') name?: FindNameUserDto,
  ) {
    if (name) {
      return this.userServices.getUserByName(name);
    }

    const users = this.userServices.getUsers();
    return users;
  }

  // Custom code error 418
  @HttpCode(418)
  @Get('coffee')
  @ApiResponse({
    status: 418,
    description: 'No se hacer café, soy una tetera.',
  })
  getCoffee() {
    return { message: `No se hacer café, soy una tetera` };
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilterPasswordInterceptor)
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'El id del usuario no contiene el formato correcto de UUID.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'El usuario con el id ingresado no existe.',
  })
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.userServices.getUserById(id);
    return user;
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description:
      'Datos del usuario con el id proporcionado actualizados correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El id del usuario no contiene el formato correcto de UUID.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'El usuario con el id ingresado no existe.',
  })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const messageUserUpdated = this.userServices.updateUser(id, updateUserDto);
    return messageUserUpdated;
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Usuario con el id eliminado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El id del usuario no contiene el formato correcto de UUID.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'El usuario con el id ingresado no existe.',
  })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    const messageUserDeleted = this.userServices.deleteUser(id);
    return messageUserDeleted;
  }
}
