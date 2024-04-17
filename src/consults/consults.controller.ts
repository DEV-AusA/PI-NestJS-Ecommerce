import { Controller, Post, Body } from '@nestjs/common';
import { ConsultsService } from './consults.service';
import { ConsultDto } from './dto/consults.dto';

@Controller('consults')
export class ConsultsController {
  constructor(private readonly consultsService: ConsultsService) {}

  @Post()
  consultProduct(@Body() consultUser: ConsultDto) {
    return this.consultsService.consultProduct(consultUser);
  }
}
