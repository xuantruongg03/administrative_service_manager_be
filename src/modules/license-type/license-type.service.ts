import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicenseType } from './entities/license-type.entity';

@Injectable()
export class LicenseTypeService implements OnModuleInit {
    constructor(
        @InjectRepository(LicenseType)
        private readonly licenseTypeRepository: Repository<LicenseType>,
    ) {}

    async onModuleInit() {
        const licenseTypes = await this.licenseTypeRepository.find();
        if (licenseTypes.length === 0) {
            await this.seedData();
        }
    }

    private async seedData() {
        const licenseTypes = [
            {
                id: '102318673847',
                name: 'Business License',
                is_mandatory: true,
            },
            {
                id: '102318673848',
                name: 'Security License',
                is_mandatory: true,
            },
        ];
        await this.licenseTypeRepository.save(licenseTypes);
        console.log('License types seeded');
    }

    async findMandatory() {
        return await this.licenseTypeRepository.find({
            where: {
                is_mandatory: true,
            },
        });
    }

    async findOne(business_code: string) {
        const licenseType = await this.licenseTypeRepository.findOne({
            where: {
                id: business_code,
            },
        });
        return licenseType;
    }
}
