import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  exejuteSeed() {
    return this.seedService.executeSeed();
  }

}
