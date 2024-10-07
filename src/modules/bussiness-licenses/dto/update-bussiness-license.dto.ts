import { PartialType } from '@nestjs/mapped-types';
import { CreateBussinessLicenseDto } from './create-bussiness-license.dto';

export class UpdateBussinessLicenseDto extends PartialType(CreateBussinessLicenseDto) {}
