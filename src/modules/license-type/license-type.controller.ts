import { Controller } from '@nestjs/common';
import { LicenseTypeService } from './license-type.service';

@Controller('license-type')
export class LicenseTypeController {
    constructor(private readonly licenseTypeService: LicenseTypeService) {}
}
