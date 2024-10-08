import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../persons/entities/persons.entity';
import { GenerateIdService } from 'src/shared/generate-id.service';

@Module({
    imports: [TypeOrmModule.forFeature([Employee, Person])],
    controllers: [EmployeesController],
    providers: [EmployeesService, GenerateIdService],
    exports: [EmployeesService],
})
export class EmployeesModule {}
