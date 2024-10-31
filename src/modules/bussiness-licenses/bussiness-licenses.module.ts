import { Module, forwardRef } from '@nestjs/common';
import { BussinessLicensesService } from './bussiness-licenses.service';
import { BussinessLicensesController } from './bussiness-licenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessLicense } from './entities/business-licenses.entity';
import { StorageService } from 'src/shared/storage/storage.service';
import { LicenseTypeService } from '../license-type/license-type.service';
import { BusinessesModule } from '../businesses/businesses.module';
import { LicenseType } from '../license-type/entities/license-type.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([BusinessLicense, LicenseType]),
        forwardRef(() => BusinessesModule),
    ],
    controllers: [BussinessLicensesController],
    providers: [BussinessLicensesService, StorageService, LicenseTypeService],
    exports: [BussinessLicensesService],
})
export class BussinessLicensesModule {}
