import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessesController } from './modules/businesses/businesses.controller';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { BusinessesService } from './modules/businesses/businesses.service';
import { Business } from './modules/businesses/entities/businesses.entity';
import { BussinessLicensesModule } from './modules/bussiness-licenses/bussiness-licenses.module';
import { BusinessLicense } from './modules/bussiness-licenses/entities/business-licenses.entity';
import { EmployeesModule } from './modules/employees/employees.module';
import { Employee } from './modules/employees/entities/employee.entity';
import { LicenseType } from './modules/license-type/entities/license-type.entity';
import { LicenseTypeModule } from './modules/license-type/license-type.module';
import { Person } from './modules/persons/entities/persons.entity';
import { PersonsModule } from './modules/persons/persons.module';
import { TypeOfOrganization } from './modules/type-of-organizations/entities/type-of-organization.entity';
import { TypeOfOrganizationsModule } from './modules/type-of-organizations/type-of-organizations.module';
import { GeocodingService } from './shared/geocoding.service';
import { StorageModule } from './shared/storage/storage.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { StatisticsController } from './modules/statistics/statistics.controller';
import { StatisticsService } from './modules/statistics/statistics.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath:
                process.env.NODE_ENV === 'production'
                    ? '.env.production'
                    : '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [
                Business,
                BusinessLicense,
                Employee,
                LicenseType,
                Person,
                TypeOfOrganization,
            ],
            synchronize: true,
            ssl: {
                rejectUnauthorized: false,
            },
            extra: {
                connectionLimit: 10,
            },
            retryAttempts: 3,
            retryDelay: 3000,
        }),
        TypeOrmModule.forFeature([
            Business,
            BusinessLicense,
            Employee,
            LicenseType,
            Person,
            TypeOfOrganization,
        ]),
        BusinessesModule,
        EmployeesModule,
        BussinessLicensesModule,
        PersonsModule,
        TypeOfOrganizationsModule,
        LicenseTypeModule,
        StorageModule,
        StatisticsModule,
    ],
    controllers: [AppController, BusinessesController, StatisticsController],
    providers: [
        AppService,
        GeocodingService,
        BusinessesService,
        StatisticsService,
    ],
})
export class AppModule {}
