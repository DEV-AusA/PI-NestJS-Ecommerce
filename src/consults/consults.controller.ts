import { Controller, Post, Body } from '@nestjs/common';
import { ConsultsService } from './consults.service';
import { CreateConsultDto } from './dto/create-consult.dto';

@Controller('consults')
export class ConsultsController {
  constructor(private readonly consultsService: ConsultsService) {}

  @Post()
  consultProduct(@Body() createConsultDto: CreateConsultDto) {
    return this.consultsService.consultProduct(createConsultDto);
  }
}
