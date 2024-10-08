import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/persons.entity';

@Injectable()
export class PersonsService {
    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
    ) {}

    create(person: Person) {
        return this.personRepository.save(person);
    }

    findAll() {
        return `This action returns all persons`;
    }

    findOne(id: number) {
        return `This action returns a #${id} person`;
    }

    update(id: number, updatePersonDto: UpdatePersonDto) {
        return `This action updates a #${id} person`;
    }

    remove(id: number) {
        return `This action removes a #${id} person`;
    }

    async checkPersonData(citizen_id: string): Promise<Person | string> {
        const person = await this.personRepository.findOne({
            where: { citizen_id: citizen_id },
        });
        return person || null;
    }
}
