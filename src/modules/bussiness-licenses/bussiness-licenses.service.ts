import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLicense } from './entities/business-licenses.entity';
import { CreateBusinessLicenseDto } from './dto/create-business-license.dto';
import { StorageService } from 'src/shared/storage/storage.service';
import { BusinessesService } from '../businesses/businesses.service';
import { LicenseTypeService } from '../license-type/license-type.service';

@Injectable()
export class BussinessLicensesService {
    constructor(
        @InjectRepository(BusinessLicense)
        private readonly businessLicenseRepository: Repository<BusinessLicense>,
        private readonly storageService: StorageService,
        @Inject(forwardRef(() => BusinessesService))
        private readonly businessesService: BusinessesService,
        private readonly licenseTypeService: LicenseTypeService,
    ) {}

    async findOne(business_code: string) {
        const license = await this.businessLicenseRepository.find({
            where: {
                business_code,
            },
        });
        return license;
    }

    async create(file: Express.Multer.File, data: CreateBusinessLicenseDto) {
        try {
            //Get name business from code
            const business = await this.businessesService.findOne(
                data.business_code,
            );
            if (!business) {
                return 'Business not found';
            }
            const name = business.name_vietnamese;
            //Get name license type
            const license_type = await this.licenseTypeService.findOne(
                data.license_type_id,
            );
            if (!license_type) {
                return 'License type not found';
            }
            const name_file = `${data.business_code}-${license_type.name}-${name}`;
            //Save file to storage
            const file_path = await this.storageService.uploadFile(
                file,
                name_file,
            );
            const license = await this.businessLicenseRepository.create({
                ...data,
                file_path,
            });
            return await this.businessLicenseRepository.save(license);
        } catch (error) {
            console.log(error);
            return 'Failed to create business license';
        }
    }

    async update(
        id: string,
        file: Express.Multer.File,
    ): Promise<BusinessLicense | string> {
        try {
            const license = await this.businessLicenseRepository.findOne({
                where: { id },
            });
            if (!license) {
                return 'Business license not found';
            }
            Object.assign(license, file);
            return await this.businessLicenseRepository.save(license);
        } catch (error) {
            console.log(error);
            return 'Failed to update business license';
        }
    }

    async remove(id: string): Promise<boolean | string> {
        try {
            const result = await this.businessLicenseRepository.delete(id);
            if (result.affected === 0) {
                return 'Business license not found';
            }
            return true;
        } catch (error) {
            console.log(error);
            return 'Failed to delete business license';
        }
    }
}
