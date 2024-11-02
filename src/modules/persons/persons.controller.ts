import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Person } from './entities/persons.entity';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
    constructor(private readonly personsService: PersonsService) {}

    @Post()
    create(@Body() createPersonDto: Person) {
        return this.personsService.create(createPersonDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.personsService.findOne(id);
    }
}
