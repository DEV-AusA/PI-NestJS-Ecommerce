import { Injectable } from '@nestjs/common';
import { CreateConsultDto } from './dto/create-consult.dto';

@Injectable()
export class ConsultsService {
  consultProduct(createConsultDto: CreateConsultDto) {
    return 'Consulta de product x aca';
  }
}
