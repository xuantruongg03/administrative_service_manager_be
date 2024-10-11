import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/persons.entity';

@Controller('persons')
export class PersonsController {
    constructor(private readonly personsService: PersonsService) {}

    @Post()
    create(@Body() createPersonDto: Person) {
        return this.personsService.create(createPersonDto);
    }

    @Get()
    findAll() {
        return this.personsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.personsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
        return this.personsService.update(+id, updatePersonDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.personsService.remove(+id);
    }
}
