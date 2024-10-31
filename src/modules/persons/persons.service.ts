import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/persons.entity';
import { BusinessesService } from '../businesses/businesses.service';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class PersonsService {
    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        @Inject(forwardRef(() => BusinessesService))
        private readonly businessesService: BusinessesService,
        @Inject(forwardRef(() => EmployeesService))
        private readonly employeesService: EmployeesService,
    ) {}

    create(person: Person) {
        return this.personRepository.save(person);
    }

    findAll() {
        return `This action returns all persons`;
    }

    async findOne(citizen_id: string): Promise<Person | null> {
        return await this.personRepository.findOne({
            where: { citizen_id: citizen_id },
        });
    }

    update(id: number, updatePersonDto: UpdatePersonDto) {
        return `This action updates a #${id} person`;
    }

    remove(id: number) {
        return `This action removes a #${id} person`;
    }

    async isPersonExist(citizen_id: string): Promise<boolean> {
        if (!citizen_id || typeof citizen_id !== 'string') {
            throw new Error('Invalid citizen_id provided');
        }

        const person = await this.personRepository.findOne({
            where: { citizen_id: citizen_id },
        });
        return person !== null && person !== undefined;
    }
}
