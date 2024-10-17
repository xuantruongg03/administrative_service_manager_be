import { Module } from '@nestjs/common';
import { BussinessLicensesService } from './bussiness-licenses.service';
import { BussinessLicensesController } from './bussiness-licenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessLicense } from './entities/business-licenses.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BusinessLicense])],
    controllers: [BussinessLicensesController],
    providers: [BussinessLicensesService],
    exports: [BussinessLicensesService],
})
export class BussinessLicensesModule {}
