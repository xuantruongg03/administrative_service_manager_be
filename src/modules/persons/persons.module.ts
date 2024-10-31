import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesModule } from '../businesses/businesses.module';
import { EmployeesModule } from '../employees/employees.module';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { Person } from './entities/persons.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Person]),
        forwardRef(() => BusinessesModule),
        forwardRef(() => EmployeesModule),
    ],
    controllers: [PersonsController],
    providers: [PersonsService],
    exports: [PersonsService],
})
export class PersonsModule {}
