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

@Module({
    imports: [TypeOrmModule.forFeature([Business, Person, TypeOfOrganization])],
    controllers: [BusinessesController],
    providers: [
        BusinessesService,
        GeocodingService,
        PersonsService,
        TypeOfOrganizationsService,
    ],
    exports: [BusinessesService],
})
export class BusinessesModule {}
