import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ConsultsService } from './consults.service';
import { ConsultDto } from './dto/consults.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('consults')
export class ConsultsController {
  constructor(private readonly consultsService: ConsultsService) {}

  @HttpCode(200)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Respuesta de la consulta exitosa.',
  })
  @ApiResponse({ status: 400, description: 'Error al realizar la consulta' })
  consultProduct(@Body() consultUser: ConsultDto) {
    return this.consultsService.consultProduct(consultUser);
  }
}
