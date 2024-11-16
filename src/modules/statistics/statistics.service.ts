import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CONSTANTS from 'src/common/constants';
import { Repository } from 'typeorm';
import { Business } from '../businesses/entities/businesses.entity';
import { BusinessLicense } from '../bussiness-licenses/entities/business-licenses.entity';
import { LicenseType } from '../license-type/entities/license-type.entity';
import { TypeOfOrganization } from '../type-of-organizations/entities/type-of-organization.entity';
import {
    BusinessLicenseStatusStatisticsDto,
    BusinessLicenseTypeStatisticsDto,
    BusinessTypeStatisticsDto,
    GetStatisticsDto,
    StatisticTrendDto,
} from './dto/statistics.dto';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Business)
        private businessRepository: Repository<Business>,
        @InjectRepository(BusinessLicense)
        private businessLicenseRepository: Repository<BusinessLicense>,
        @InjectRepository(LicenseType)
        private licenseTypeRepository: Repository<LicenseType>,
        @InjectRepository(TypeOfOrganization)
        private typeOfOrganizationRepository: Repository<TypeOfOrganization>,
    ) {}

    async getStatistics(
        type: 'month' | 'quarter' | 'year' | 'custom',
        value: string,
    ): Promise<GetStatisticsDto | string> {
        try {
            const total_businesses = await this.countTotalBusinesses(
                type,
                value,
            );
            if (typeof total_businesses === 'string') {
                return 'Get total businesses failed';
            }
            const total_business_licenses =
                await this.countTotalBusinessLicenses(type, value);
            if (typeof total_business_licenses === 'string') {
                return 'Get total business licenses failed';
            }
            const violated_businesses = await this.countViolatedBusinesses(
                type,
                value,
            );
            if (typeof violated_businesses === 'string') {
                return 'Get violated businesses failed';
            }
            const new_businesses = await this.countNewBusinesses(type, value);
            if (typeof new_businesses === 'string') {
                return 'Get new businesses failed';
            }
            const business_trend = await this.getBusinessNewTrend(type, value);
            if (typeof business_trend === 'string') {
                return 'Get business trend failed';
            }

            const business_type_statistics =
                await this.getBusinessTypeStatistics(type, value);
            if (typeof business_type_statistics === 'string') {
                return 'Get business type statistics failed';
            }

            const business_license_type_statistics =
                await this.getBusinessLicenseTypeStatistics(type, value);
            if (typeof business_license_type_statistics === 'string') {
                return 'Get business license type statistics failed';
            }

            const business_license_status_statistics =
                await this.getBusinessLicenseComplianceStatistics(type, value);
            if (typeof business_license_status_statistics === 'string') {
                return 'Get business license status statistics failed';
            }

            return {
                total_businesses: total_businesses,
                total_business_licenses: total_business_licenses,
                violated_businesses: violated_businesses,
                new_businesses: new_businesses,
                business_trend: business_trend,
                business_type_statistics: business_type_statistics,
                business_license_type_statistics:
                    business_license_type_statistics,
                business_license_status_statistics:
                    business_license_status_statistics,
            };
        } catch (error) {
            console.log('🚀 ~ StatisticsService ~ error:', error);
            return 'Get statistics failed';
        }
    }

    private buildTimeQuery(type: string, value: string) {
        const query: any = {};
        switch (type) {
            case 'custom':
                const [startDate, endDate] = value.split(' - ');
                query.where = `created_at >= :startDate AND created_at <= :endDate`;
                query.parameters = {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate + ' 23:59:59'),
                };
                break;
            case 'month':
                query.where = `EXTRACT(MONTH FROM created_at) = :month 
                              AND EXTRACT(YEAR FROM created_at) = :year`;
                const [month, year] = value.split('/');
                query.parameters = { month, year };
                break;
            case 'quarter':
                query.where = `EXTRACT(QUARTER FROM created_at) = :quarter 
                              AND EXTRACT(YEAR FROM created_at) = :year`;
                const [quarter, yearQ] = value.split('/');
                query.parameters = { quarter, year: yearQ };
                break;
            case 'year':
                query.where = `EXTRACT(YEAR FROM created_at) = :year`;
                query.parameters = { year: value };
                break;
        }
        return query;
    }

    async countTotalBusinesses(type: string, value: string): Promise<number> {
        const query = this.buildTimeQuery(type, value);
        return await this.businessRepository
            .createQueryBuilder()
            .where(query.where, query.parameters)
            .getCount();
    }

    async countTotalBusinessLicenses(
        type: string,
        value: string,
    ): Promise<number> {
        const query = this.buildTimeQuery(type, value);
        return await this.businessLicenseRepository
            .createQueryBuilder()
            .where(query.where, query.parameters)
            .getCount();
    }

    async countNewBusinesses(
        type: 'month' | 'quarter' | 'year' | 'custom',
        value: string,
    ): Promise<number | string> {
        try {
            const query = this.buildTimeQuery(type, value);
            return await this.businessRepository
                .createQueryBuilder()
                .where(`${query.where} AND status = :status`, {
                    ...query.parameters,
                    status: 'active',
                })
                .getCount();
        } catch (error) {
            console.log(
                '🚀 ~ StatisticsService ~ countNewBusinesses ~ error:',
                error,
            );
            return 'Get new businesses failed';
        }
    }

    async countViolatedBusinesses(
        type: 'month' | 'quarter' | 'year' | 'custom',
        value: string,
    ): Promise<number | string> {
        try {
            const query = this.buildTimeQuery(type, value);

            // Get all businesses for the time period
            const businesses = await this.businessRepository
                .createQueryBuilder('business')
                .where(query.where, query.parameters)
                .getMany();

            let violatedCount = 0;

            // Check each business for missing licenses
            for (const business of businesses) {
                // Get all licenses for this business
                const licenses = await this.businessLicenseRepository.find({
                    where: { business_id: business.id },
                });

                // If no licenses exist at all, count as violated
                if (!licenses || licenses.length === 0) {
                    violatedCount++;
                    continue;
                }

                // Get the list of required license types
                const mandatoryLicenses = await this.licenseTypeRepository.find(
                    {
                        where: { is_mandatory: true },
                    },
                );

                // Check if any mandatory license is missing
                for (const mandatoryLicense of mandatoryLicenses) {
                    const hasLicense = licenses.some(
                        (license) =>
                            license.license_type_id === mandatoryLicense.id,
                    );

                    if (!hasLicense) {
                        violatedCount++;
                        break; // Count this business once and move to next
                    }
                }
            }

            return violatedCount;
        } catch (error) {
            console.log(
                '🚀 ~ StatisticsService ~ countViolatedBusinesses ~ error:',
                error,
            );
            return 'Get violated businesses failed';
        }
    }

    async getBusinessNewTrend(
        type: 'month' | 'quarter' | 'year' | 'custom',
        value: string,
    ): Promise<StatisticTrendDto | string> {
        try {
            const { startDate, endDate } = this.getDateRange(type, value);

            // Điều chỉnh format dựa trên type
            const dateFormat =
                type === 'month'
                    ? '%d/%m/%Y' // Ngày/tháng/năm cho type month
                    : '%m/%Y'; // Tháng/năm cho quarter và year

            const data = await this.businessRepository
                .createQueryBuilder('business')
                .select([
                    `DATE_FORMAT(business.created_at, '${dateFormat}') as date`,
                    'COUNT(*) as count',
                ])
                .where('business.created_at >= :startDate', { startDate })
                .andWhere('business.created_at <= :endDate', { endDate })
                .andWhere('business.status = :status', { status: 'active' })
                .groupBy(`DATE_FORMAT(business.created_at, '${dateFormat}')`)
                .orderBy(`DATE_FORMAT(business.created_at, '${dateFormat}')`)
                .getRawMany();

            // Tạo labels dựa trên type
            let labels = [];
            if (type === 'month') {
                labels = this.getRangeDate(startDate, endDate);
            } else if (type === 'quarter') {
                labels = this.getQuarterRange();
            } else {
                labels = this.getYearRange();
            }

            let counts = [];

            if (type === 'month') {
                counts = labels.map((label) => {
                    const found = data.find((d) => {
                        const date = d.date.split('/');
                        return date[1] === String(label);
                    });
                    return found ? parseInt(found.count) : 0;
                });
            } else if (type === 'quarter') {
                counts = labels.map((label) => {
                    const found = data.find((d) => {
                        return label === this.getQuarter(d.date);
                    });
                    return found ? parseInt(found.count) : 0;
                });
            } else {
                counts = labels.map((label) => {
                    const found = data.find(
                        (d) => d.date.split('/')[0] === String(label),
                    );
                    return found ? parseInt(found.count) : 0;
                });
            }

            const rs = {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh nghiệp mới',
                        data: counts,
                    },
                ],
            };
            return rs;
        } catch (error) {
            console.log(
                '🚀 ~ StatisticsService ~ getBusinessTrend ~ error:',
                error,
            );
            return 'Get business trend failed';
        }
    }

    private getQuarter(value: string) {
        const [month] = value.split('/').map(Number);
        return Math.ceil((month + 1) / 3);
    }

    private getDateRange(
        type: 'month' | 'quarter' | 'year' | 'custom',
        value: string,
    ): { startDate: Date; endDate: Date } {
        if (type === 'custom') {
            const [startDate, endDate] = value.split(' - ');
            return {
                startDate: new Date(startDate),
                endDate: new Date(endDate + ' 23:59:59'),
            };
        } else if (type === 'month') {
            // Định dạng value: 'MM/YYYY'
            const [month, year] = value.split('/').map(Number);

            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);

            return { startDate, endDate };
        } else if (type === 'quarter') {
            // Định dạng value: 'Q/YYYY' (ví dụ: "1/2024" cho quý 1 năm 2024)
            const [quarter, year] = value.split('/').map(Number);

            // Tính tháng bắt đầu và kết thúc của quý
            const startMonth = (quarter - 1) * 3;
            const endMonth = startMonth + 2;

            const startDate = new Date(year, startMonth, 1);
            const endDate = new Date(year, endMonth + 1, 0, 23, 59, 59, 999);

            return { startDate, endDate };
        } else {
            // Định dạng value: 'YYYY'
            const year = parseInt(value);

            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

            return { startDate, endDate };
        }
    }

    async getYearlyQuarterTrend(year: string) {
        try {
            const trends = [];

            // Lấy thống kê cho cả 4 quý trong năm
            for (let quarter = 1; quarter <= 4; quarter++) {
                const value = `${quarter}/${year}`;
                const { startDate, endDate } = this.getDateRange(
                    'quarter',
                    value,
                );

                const count = await this.businessRepository
                    .createQueryBuilder('business')
                    .where('business.created_at >= :startDate', { startDate })
                    .andWhere('business.created_at <= :endDate', { endDate })
                    .andWhere('business.status = :status', { status: 'active' })
                    .getCount();

                trends.push({
                    quarter: quarter,
                    period: `Q${quarter}/${year}`,
                    count: count,
                    startDate,
                    endDate,
                });
            }

            return {
                success: true,
                data: trends,
                message: 'Lấy dữ liệu theo quý thành công',
            };
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu theo quý:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi lấy dữ liệu theo quý',
            };
        }
    }

    private getRangeDate(startDate: Date, endDate: Date) {
        const dates: number[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(currentDate.getDate());
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    private getQuarterRange() {
        const quarters: number[] = [];
        for (let q = 1; q <= 4; q++) {
            quarters.push(q);
        }
        return quarters;
    }

    private getYearRange() {
        const months: number[] = [];
        for (let month = 1; month <= 12; month++) {
            months.push(month);
        }
        return months;
    }

    async getBusinessTypeStatistics(
        type: string,
        value: string,
    ): Promise<BusinessTypeStatisticsDto | string> {
        try {
            const query = this.buildTimeQuery(type, value);
            const typeOfOrganizations =
                await this.typeOfOrganizationRepository.find();

            const businessTypes = await this.businessRepository
                .createQueryBuilder('business')
                .select('business.type_of_organization', 'type')
                .addSelect('COUNT(*)', 'count')
                .where(query.where, query.parameters)
                .groupBy('business.type_of_organization')
                .getRawMany();

            const labels = [];
            const data = [];
            const backgroundColor = [];

            typeOfOrganizations.forEach((item, index) => {
                labels.push(
                    item.name
                        .replace(/^Kinh doanh\s+/i, '')
                        .replace(/^\w/, (c) => c.toUpperCase()),
                );
                data.push(
                    parseInt(
                        businessTypes.find((b) => b.type === item.id)?.count ||
                            '0',
                    ),
                );
                backgroundColor.push(CONSTANTS.COLOR_ARRAY[index]);
            });

            const rs = {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor,
                    },
                ],
            };
            return rs;
        } catch (error) {
            console.error(
                'Lỗi khi lấy dữ liệu thống kê loại hình doanh nghiệp:',
                error,
            );
            return 'Get business type statistics failed';
        }
    }

    async getBusinessLicenseTypeStatistics(
        type: string,
        value: string,
    ): Promise<BusinessLicenseTypeStatisticsDto | string> {
        try {
            const query = this.buildTimeQuery(type, value);

            const businessLicenses = await this.businessLicenseRepository
                .createQueryBuilder('business_licenses')
                .select('business_licenses.file_path', 'file_path')
                .where(query.where, query.parameters)
                .groupBy('business_licenses.file_path')
                .getRawMany();

            const labels = [];
            const data = [];
            const backgroundColor = [];

            CONSTANTS.ACCEPT_FILE_BUSINESS_LICENSE.forEach((item) => {
                labels.push(item);
            });

            // Initialize counts object to track file extensions
            const counts = {};
            // Count occurrences of each file extension
            businessLicenses.forEach((item) => {
                const ext = item.file_path.split('.').pop();
                counts[ext] = (counts[ext] || 0) + 1;
            });

            // Populate data arrays based on labels
            labels.forEach((label, index) => {
                data.push(counts[label] || 0);
                backgroundColor.push(CONSTANTS.COLOR_ARRAY[index]);
            });

            return {
                labels,
                datasets: [
                    {
                        label: 'Số lượng',
                        data,
                        backgroundColor,
                    },
                ],
            };
        } catch (error) {
            console.error(
                'Lỗi khi lấy dữ liệu thống kê loại giấy phép:',
                error,
            );
            return 'Get business license type statistics failed';
        }
    }

    async getBusinessLicenseComplianceStatistics(
        type: string,
        value: string,
    ): Promise<BusinessLicenseStatusStatisticsDto | string> {
        try {
            const query = this.buildTimeQuery(type, value);

            // Get all businesses for the time period
            const businesses = await this.businessRepository
                .createQueryBuilder('business')
                .where(query.where, query.parameters)
                .getMany();

            let compliantCount = 0;
            let violatedCount = 0;

            // Get the list of required license types once
            const mandatoryLicenses = await this.licenseTypeRepository.find({
                where: { is_mandatory: true },
            });

            // Check each business for licenses
            for (const business of businesses) {
                const licenses = await this.businessLicenseRepository.find({
                    where: { business_id: business.id },
                });

                // If no licenses exist at all, count as violated
                if (!licenses || licenses.length === 0) {
                    violatedCount++;
                    continue;
                }

                let isCompliant = true;
                // Check if any mandatory license is missing
                for (const mandatoryLicense of mandatoryLicenses) {
                    const hasLicense = licenses.some(
                        (license) =>
                            license.license_type_id === mandatoryLicense.id,
                    );

                    if (!hasLicense) {
                        isCompliant = false;
                        break;
                    }
                }

                if (isCompliant) {
                    compliantCount++;
                } else {
                    violatedCount++;
                }
            }

            return {
                labels: ['Đủ giấy phép', 'Thiếu giấy phép'],
                datasets: [
                    {
                        data: [compliantCount, violatedCount],
                        backgroundColor: [
                            CONSTANTS.COLOR_ARRAY[0],
                            CONSTANTS.COLOR_ARRAY[1],
                        ],
                    },
                ],
            };
        } catch (error) {
            console.error(
                'Lỗi khi lấy dữ liệu thống kê về tình trạng giấy phép:',
                error,
            );
            return 'Get business license compliance statistics failed';
        }
    }
}
