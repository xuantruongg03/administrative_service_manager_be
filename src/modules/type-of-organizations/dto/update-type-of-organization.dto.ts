import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfOrganizationDto } from './create-type-of-organization.dto';

export class UpdateTypeOfOrganizationDto extends PartialType(
    CreateTypeOfOrganizationDto,
) {}
