import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Business } from '../businesses/entities/businesses.entity';
import { BusinessLicense } from '../bussiness-licenses/entities/business-licenses.entity';
import { LicenseType } from '../license-type/entities/license-type.entity';
import { TypeOfOrganization } from '../type-of-organizations/entities/type-of-organization.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Business,
            BusinessLicense,
            LicenseType,
            TypeOfOrganization,
        ]),
    ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule {}
