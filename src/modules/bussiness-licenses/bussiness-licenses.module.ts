import { Module } from '@nestjs/common';
import { BussinessLicensesService } from './bussiness-licenses.service';
import { BussinessLicensesController } from './bussiness-licenses.controller';

@Module({
  controllers: [BussinessLicensesController],
  providers: [BussinessLicensesService],
})
export class BussinessLicensesModule {}
