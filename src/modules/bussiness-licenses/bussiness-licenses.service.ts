import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CONSTANTS from 'src/common/constants';
import { StorageService } from 'src/shared/storage/storage.service';
import { ILike, Repository } from 'typeorm';
import { BusinessesService } from '../businesses/businesses.service';
import { LicenseTypeService } from '../license-type/license-type.service';
import {
    BusinessLicenseDetailDto,
    BusinessLicenseDto,
} from './dto/business-license.dto';
import { BusinessLicense } from './entities/business-licenses.entity';

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

    async getAllBusinessLicense(
        page: number,
        limit: number,
        keyword?: string,
    ): Promise<{
        data: BusinessLicenseDetailDto[];
        totalPages: number;
        isLastPage: boolean;
        totalRecords: number;
    }> {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, limit);
        let skip = (validPage - 1) * validLimit;
        if (skip < 0) {
            skip = 0;
        }

        let licenses;
        let totalRecords;

        try {
            [licenses, totalRecords] =
                await this.businessLicenseRepository.findAndCount({
                    skip: (validPage - 1) * validLimit,
                    take: validLimit,
                    order: {
                        updated_at: 'DESC',
                    },
                });

            if (keyword && keyword.trim() !== '') {
                [licenses, totalRecords] =
                    await this.businessLicenseRepository.findAndCount({
                        where: [{ name: ILike(`%${keyword}%`) }],
                        skip: (validPage - 1) * validLimit,
                        take: validLimit,
                        order: {
                            updated_at: 'DESC',
                        },
                    });
            }

            const totalPages = Math.ceil(totalRecords / validLimit);
            const isLastPage = totalRecords <= validPage * validLimit;

            return {
                data: await Promise.all(
                    licenses.map(async (license) => {
                        const business = await this.businessesService.findOne(
                            license.business_id,
                        );
                        const licenseType =
                            await this.licenseTypeService.findById(
                                license.license_type_id,
                            );
                        return {
                            id: license.id,
                            status: license.status,
                            type: licenseType.name,
                            name: license.name,
                            file: license.file_path,
                            size: license.size,
                            company: business.name_vietnamese,
                            address: business.address,
                            update_at: license.updated_at.toString(),
                        };
                    }),
                ),
                totalPages,
                isLastPage,
                totalRecords,
            };
        } catch (error) {
            console.error('Error in getAllBusinessLicense:', error);
            throw error;
        }
    }

    async findOne(businessId: string): Promise<BusinessLicenseDto[]> {
        const license = await this.businessLicenseRepository.findBy({
            business_id: businessId,
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
            const { file_path, size } = await this.storageService.uploadFile(
                file,
                license.name,
            );
            Object.assign(license, { file_path, size });
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

    async deleteMultiple(ids: string[]): Promise<boolean | string> {
        try {
            const result = await this.businessLicenseRepository.softDelete(ids);
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
        businessId: string,
        licenseType: string,
    ) {
        const business = await this.businessesService.findOne(businessId);
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

            const license_type =
                await this.licenseTypeService.findByName(licenseType);
            if (!license_type) {
                return 'License type not found';
            }

            // Check if license already exists for this business and type
            const existingLicense =
                await this.businessLicenseRepository.findOne({
                    where: {
                        business_id: businessId,
                        license_type_id: license_type.id,
                    },
                });

            if (existingLicense) {
                return 'License already exists for this business';
            }

            const name = business.name_vietnamese;
            const name_file = `${business.code}-${nameType}-${name}`;
            const { file_path, size } = await this.storageService.uploadFile(
                file,
                name_file,
            );

            const id = await this.generateId();
            const license = await this.businessLicenseRepository.create({
                business_id: businessId,
                file_path,
                id,
                license_type_id: license_type.id,
                status: 'normal',
                name: name_file,
                size,
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
