import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLicense } from './entities/business-licenses.entity';
import { BusinessLicenseDto } from './dto/business-license.dto';
import { StorageService } from 'src/shared/storage/storage.service';
import { BusinessesService } from '../businesses/businesses.service';
import { LicenseTypeService } from '../license-type/license-type.service';
import CONSTANTS from 'src/common/constants';

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

    async findOne(business_code: string): Promise<BusinessLicenseDto[]> {
        const license = await this.businessLicenseRepository.findBy({
            business_code,
        });
        const licenses = await Promise.all(
            license.map(async (license) => {
                const nameLicense = await this.licenseTypeService.findById(
                    license.license_type_id,
                );
                return {
                    id: license.id,
                    name: license.name,
                    status: license.status,
                    type: nameLicense.name,
                };
            }),
        );
        return licenses;
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

    async delete(id: string): Promise<boolean | string> {
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

    async generateId() {
        const id = Math.random()
            .toString(36)
            .substring(2, CONSTANTS.LENGTH_ID + 2);
        const isExist = await this.businessLicenseRepository.findOne({
            where: { id: id },
        });
        if (isExist) {
            return this.generateId();
        }
        return id;
    }

    async createLicense(
        file: Express.Multer.File,
        businessCode: string,
        licenseType: string,
    ) {
        const business = await this.businessesService.findOne(businessCode);
        if (!business) {
            return 'Business not found';
        }
        try {
            let nameType = '';
            if (licenseType === CONSTANTS.LICENSE_TYPE.BUSINESS)
                nameType = 'Giấy phép kinh doanh';
            if (licenseType === CONSTANTS.LICENSE_TYPE.SECURITY)
                nameType = 'Giấy phép an ninh trật tự';
            if (licenseType === CONSTANTS.LICENSE_TYPE.FIRE)
                nameType = 'Giấy phép phòng cháy chữa cháy';
            const name = business.name_vietnamese;
            const name_file = `${businessCode}-${nameType}-${name}`;
            const file_path = await this.storageService.uploadFile(
                file,
                name_file,
            );
            const license_type =
                await this.licenseTypeService.findByName(licenseType);
            if (!license_type) {
                return 'License type not found';
            }
            const id = await this.generateId();
            const license = await this.businessLicenseRepository.create({
                business_code: businessCode,
                file_path,
                id,
                license_type_id: license_type.id,
                status: 'normal',
                name: name_file,
            });
            await this.businessLicenseRepository.save(license);
            return true;
        } catch (error) {
            console.log(error);
            return `Failed to create ${licenseType.toLowerCase()}`;
        }
    }

    async createBusinessLicense(
        file: Express.Multer.File,
        businessCode: string,
    ) {
        return this.createLicense(
            file,
            businessCode,
            CONSTANTS.LICENSE_TYPE.BUSINESS,
        );
    }

    async createSecurityLicense(
        file: Express.Multer.File,
        businessCode: string,
    ) {
        return this.createLicense(
            file,
            businessCode,
            CONSTANTS.LICENSE_TYPE.SECURITY,
        );
    }

    async createFirePreventionLicense(
        file: Express.Multer.File,
        businessCode: string,
    ) {
        return this.createLicense(
            file,
            businessCode,
            CONSTANTS.LICENSE_TYPE.FIRE,
        );
    }
}
