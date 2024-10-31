import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateBusinessLicenseDto {
    @IsNotEmpty()
    @IsString()
    business_code: string;

    @IsNotEmpty()
    @IsString()
    license_type_id: string;

    @IsOptional()
    @IsDate()
    issued_date?: Date;

    @IsOptional()
    @IsDate()
    expiry_date?: Date;
}
