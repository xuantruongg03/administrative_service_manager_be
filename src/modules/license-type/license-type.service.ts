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
                name: 'Giấy phép kinh doanh',
                is_mandatory: true,
            },
            {
                id: '102318673848',
                name: 'Giấy phép ANTT',
                is_mandatory: true,
            },
            {
                id: '102318673849',
                name: 'Giấy phép PCCC',
                is_mandatory: true,
            },
            {
                id: '102318673850',
                name: 'Giấy phép vệ sinh thực phẩm',
                is_mandatory: false,
            },
            {
                id: '102318673851',
                name: 'Giấy phép cung cấp dịch vụ số',
                is_mandatory: false,
            },
            {
                id: '102318673852',
                name: 'Giấy phép kinh doanh vận tải',
                is_mandatory: false,
            },
            {
                id: '102318673853',
                name: 'Giấy phép kinh doanh du lịch lữ hành',
                is_mandatory: false,
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

    async findAll() {
        return await this.licenseTypeRepository.find();
    }

    async findOne(business_code: string) {
        const licenseType = await this.licenseTypeRepository.findOne({
            where: {
                id: business_code,
            },
        });
        return licenseType;
    }

    async findByName(name: string) {
        return await this.licenseTypeRepository.findOne({
            where: {
                name,
            },
        });
    }

    async findById(id: string) {
        return await this.licenseTypeRepository.findOne({
            where: {
                id,
            },
        });
    }
}
