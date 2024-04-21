import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';
import { ApiBearerAuth, ApiExcludeController, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({ status: 200, description: 'Seed de productos cargado Correctamente.' })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  exejuteSeed() {
    return this.seedService.executeSeed();
  }

}
