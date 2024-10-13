import { Controller, Get } from '@nestjs/common';
import { return_success } from 'src/common/return';
import { TypeOfOrganizationsService } from './type-of-organizations.service';

@Controller('type-of-organizations')
export class TypeOfOrganizationsController {
    constructor(
        private readonly typeOfOrganizationsService: TypeOfOrganizationsService,
    ) {}

    @Get()
    async findAll() {
        const rs = await this.typeOfOrganizationsService.findAll();
        return return_success('Type of organizations fetched successfully', rs);
    }
}
