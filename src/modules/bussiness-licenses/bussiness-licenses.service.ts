import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLicense } from './entities/business-licenses.entity';

@Injectable()
export class BussinessLicensesService {
    constructor(
        @InjectRepository(BusinessLicense)
        private readonly businessLicenseRepository: Repository<BusinessLicense>,
    ) {}

    async findOne(business_code: string) {
        const license = await this.businessLicenseRepository.find({
            where: {
                business_code,
            },
        });
        return license;
    }
}
