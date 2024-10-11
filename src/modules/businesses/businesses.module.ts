import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocodingService } from 'src/shared/geocoding.service';
import { Person } from '../persons/entities/persons.entity';
import { PersonsService } from '../persons/persons.service';
import { TypeOfOrganization } from '../type-of-organizations/entities/type-of-organization.entity';
import { TypeOfOrganizationsService } from '../type-of-organizations/type-of-organizations.service';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { Business } from './entities/businesses.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeesService } from '../employees/employees.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Business,
            Person,
            TypeOfOrganization,
            Employee,
        ]),
    ],
    controllers: [BusinessesController],
    providers: [
        BusinessesService,
        GeocodingService,
        PersonsService,
        TypeOfOrganizationsService,
        EmployeesService,
    ],
    exports: [BusinessesService],
})
export class BusinessesModule {}
