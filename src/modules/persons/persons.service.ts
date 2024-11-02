import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/persons.entity';
import { BusinessesService } from '../businesses/businesses.service';
import { EmployeesService } from '../employees/employees.service';
import CONSTANTS from 'src/common/constants';

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

    async create(person: Person) {
        person.id = await this.generateId();
        return this.personRepository.save(person);
    }

    public async generateId(): Promise<string> {
        const id = Math.random()
            .toString(36)
            .substring(2, CONSTANTS.LENGTH_ID + 2);
        const isExist = await this.personRepository.findOne({
            where: { id },
        });
        if (isExist) {
            return this.generateId();
        }
        return id;
    }

    async findOne(id: string): Promise<Person | null> {
        return await this.personRepository.findOne({
            where: { id },
        });
    }

    async findByCitizenId(citizen_id: string): Promise<Person | null> {
        return await this.personRepository.findOne({
            where: { citizen_id },
        });
    }

    async update(id: string, updatePersonDto: UpdatePersonDto) {
        return this.personRepository.update(id, updatePersonDto);
    }

    async isPersonExist(citizen_id: string): Promise<boolean> {
        if (!citizen_id || typeof citizen_id !== 'string') {
            throw new Error('Invalid citizen_id provided');
        }

        const person = await this.personRepository.findOne({
            where: { citizen_id },
        });
        return person !== null && person !== undefined;
    }
}
