import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocodingService } from 'src/shared/geocoding.service';
import { BussinessLicensesModule } from '../bussiness-licenses/bussiness-licenses.module';
import { EmployeesModule } from '../employees/employees.module';
import { LicenseTypeModule } from '../license-type/license-type.module';
import { PersonsModule } from '../persons/persons.module';
import { TypeOfOrganizationsModule } from '../type-of-organizations/type-of-organizations.module';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { Business } from './entities/businesses.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Business]),
        forwardRef(() => BussinessLicensesModule),
        forwardRef(() => EmployeesModule),
        forwardRef(() => PersonsModule),
        LicenseTypeModule,
        TypeOfOrganizationsModule,
    ],
    controllers: [BusinessesController],
    providers: [BusinessesService, GeocodingService],
    exports: [BusinessesService],
})
export class BusinessesModule {}
