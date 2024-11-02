import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
    citizen_id: string;
    name: string;
    birth_date: Date;
    gender: string;
    nationality: string;
    religion: string;
    hometown: string;
    current_address: string;
}
