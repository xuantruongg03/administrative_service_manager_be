import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsService } from '../persons/persons.service';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { Person } from '../persons/entities/persons.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Employee, Person])],
    controllers: [EmployeesController],
    providers: [EmployeesService, PersonsService],
    exports: [EmployeesService],
})
export class EmployeesModule {}
