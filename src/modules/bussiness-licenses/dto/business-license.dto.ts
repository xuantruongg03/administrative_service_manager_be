export class BusinessLicenseDto {
    type: string;
    licenses: {
        id: string;
        name: string;
        status: string;
    }[];
}

export class BusinessLicenseDetailDto {
    id: string;
    status: string;
    type: string;
    name: string;
    file: string;
    size: number;
    company: string;
    address: string;
    update_at: string;
}
