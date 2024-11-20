import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CONSTANTS from 'src/common/constants';
import { StorageService } from 'src/shared/storage/storage.service';
import { Repository } from 'typeorm';
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
        currentPage: number;
    }> {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, limit);
        console.log('🚀 ~ BussinessLicensesService ~ validLimit:', validLimit);
        let skip = (validPage - 1) * validLimit;
        if (skip < 0) {
            skip = 0;
        }

        try {
            // Create query builder with proper join
            const query = this.businessLicenseRepository
                .createQueryBuilder('license')
                .leftJoinAndSelect(
                    'businesses',
                    'business',
                    'business.id = license.business_id AND business.deleted_at IS NULL',
                );

            // Add keyword search if provided
            if (keyword && keyword.trim() !== '') {
                query.andWhere('license.name ILIKE :keyword', {
                    keyword: `%${keyword}%`,
                });
            }

            // Get total count and records
            const [licenses, totalRecords] = await query
                .skip((validPage - 1) * validLimit)
                .take(validLimit)
                .orderBy('license.updated_at', 'DESC')
                .getManyAndCount();

            console.log(
                '🚀 ~ BussinessLicensesService ~ totalRecords:',
                totalRecords,
            );
            console.log(
                '🚀 ~ BussinessLicensesService ~ validLimit:',
                validLimit,
            );
            const totalPages = Math.ceil(totalRecords / validLimit);
            const isLastPage = totalRecords <= validPage * validLimit;

            // Map the results
            const licensesData = await Promise.all(
                licenses.map(async (license) => {
                    try {
                        const business = await this.businessesService.findOne(
                            license.business_id,
                        );

                        // Skip this license if the business doesn't exist or is deleted
                        if (!business) {
                            return null;
                        }

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
                    } catch (error) {
                        console.error(
                            `Error processing license ${license.id}:`,
                            error,
                        );
                        return null;
                    }
                }),
            );

            // Filter out null values (licenses with deleted businesses)
            const validLicenses = licensesData.filter(
                (license): license is BusinessLicenseDetailDto =>
                    license !== null,
            );
            const totalValidRecords = validLicenses.length;

            return {
                data: validLicenses,
                totalPages,
                isLastPage,
                totalRecords: totalValidRecords,
                currentPage: validPage,
            };
        } catch (error) {
            console.error('Error in getAllBusinessLicense:', error);
            throw error;
        }
    }

    async findOne(businessId: string) {
        const licenses = await this.businessLicenseRepository.findBy({
            business_id: businessId,
        });

        // Group licenses by type
        const licensesByType = new Map<
            string,
            Array<{ id: string; name: string; status: string }>
        >();

        await Promise.all(
            licenses.map(async (license) => {
                const licenseType = await this.licenseTypeService.findById(
                    license.license_type_id,
                );

                const simplifiedLicense = {
                    id: license.id,
                    name: license.name,
                    status: license.status,
                    file: license.file_path,
                };

                if (!licensesByType.has(licenseType.name)) {
                    licensesByType.set(licenseType.name, [simplifiedLicense]);
                } else {
                    licensesByType
                        .get(licenseType.name)!
                        .push(simplifiedLicense);
                }
            }),
        );

        // Convert the Map to array format matching the new DTO
        const result = [];
        licensesByType.forEach((licenses, type) => {
            result.push({ type, licenses });
        });

        return result;
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

    async deleteByBusinessId(businessId: string): Promise<boolean | string> {
        try {
            const result = await this.businessLicenseRepository.delete({
                business_id: businessId,
            });
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
        typeLicenseId: string,
    ) {
        const business = await this.businessesService.findOne(businessId);
        if (!business) {
            return 'Business not found';
        }

        try {
            const license_type =
                await this.licenseTypeService.findById(typeLicenseId);
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

            let name = business.name_vietnamese;
            let name_file = `${business.code}-${license_type.name}-${name}`;
            let countLicense = 0;

            const licenses = business.licenses as BusinessLicenseDto[];
            const matchingLicenseGroup = licenses.find(
                (group) => group.type === license_type.name,
            );
            countLicense = matchingLicenseGroup
                ? matchingLicenseGroup.licenses.length
                : 0;

            if (existingLicense) {
                name_file = `p${countLicense + 1} - ` + name_file;
                name = `p${countLicense + 1} - ` + name;
            }

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
            return `Failed to create license`;
        }
    }
}
