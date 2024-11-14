import { Controller, Get } from '@nestjs/common';
import { LicenseTypeService } from './license-type.service';
import { return_success } from 'src/common/return';

@Controller('license-types')
export class LicenseTypeController {
    constructor(private readonly licenseTypeService: LicenseTypeService) {}

    @Get('')
    async findAll() {
        const rs = await this.licenseTypeService.findAll();
        return return_success('Get all license types successfully', rs);
    }
}
