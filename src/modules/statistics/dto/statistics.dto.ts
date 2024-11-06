export class StatisticTrendDto {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

export class BusinessTypeStatisticsDto {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
    }[];
}

export class BusinessLicenseTypeStatisticsDto {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
}

export class BusinessLicenseStatusStatisticsDto {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
    }[];
}

export class GetStatisticsDto {
    total_businesses: number;
    total_business_licenses: number;
    violated_businesses: number;
    new_businesses: number;
    business_trend: StatisticTrendDto;
    business_type_statistics: BusinessTypeStatisticsDto;
    business_license_type_statistics: BusinessLicenseTypeStatisticsDto;
    business_license_status_statistics: BusinessLicenseStatusStatisticsDto;
}
