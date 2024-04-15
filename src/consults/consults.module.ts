import { Module } from '@nestjs/common';
import { ConsultsService } from './consults.service';
import { ConsultsController } from './consults.controller';

@Module({
  controllers: [ConsultsController],
  providers: [ConsultsService],
})
export class ConsultsModule {}
