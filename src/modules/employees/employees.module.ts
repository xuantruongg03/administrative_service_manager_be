import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesModule } from '../businesses/businesses.module';
import { PersonsModule } from '../persons/persons.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Employee]),
        forwardRef(() => BusinessesModule),
        forwardRef(() => PersonsModule),
    ],
    controllers: [EmployeesController],
    providers: [EmployeesService],
    exports: [EmployeesService],
})
export class EmployeesModule {}
