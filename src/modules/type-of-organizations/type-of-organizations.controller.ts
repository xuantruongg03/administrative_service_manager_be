import { Controller, Get } from '@nestjs/common';
import { TypeOfOrganizationDTO } from './dto/type-of-organization.dto';
import { TypeOfOrganizationsService } from './type-of-organizations.service';

@Controller('type-of-organizations')
export class TypeOfOrganizationsController {
    constructor(
        private readonly typeOfOrganizationsService: TypeOfOrganizationsService,
    ) {}

    @Get()
    async findAll(): Promise<TypeOfOrganizationDTO[]> {
        return this.typeOfOrganizationsService.findAll();
    }
}
