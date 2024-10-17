import { EmployeeDTO } from 'src/modules/employees/dto/employee.dto';

export class BusinessDTO {
    code: string;
    name_vietnamese: string;
    name_english: string;
    name_acronym: string;
    address: string;
    email: string;
    phone: string;
    fax: string;
    website: string;
    chartered_capital: string;
    type_of_organization: string;
    owner_id: string;
    legal_representative: string;
    latitude: number;
    longitude: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    number_of_employees: number;
}

export class BusinessInforDTO {
    code: string;
    name_vietnamese: string;
    name_english: string;
    name_acronym: string;
    address: string;
    email: string;
    phone: string;
    fax: string;
    website: string;
    chartered_capital: string;
    type_of_organization: string;
    owner: string;
    legal_representative: string;
    number_of_employees: number;
    status: string;
    employee: EmployeeDTO[];
    created_at: Date;
}

export class BusinessMapDTO {
    code: string;
    name_vietnamese: string;
    address: string;
    type_of_organization: string;
    latitude: number;
    longitude: number;
    status: string;
    created_at: Date;
    number_of_employees: number;
    license_status: string[];
}

export class MapData {
    name: string;
    address: string;
    status: string;
    number_of_problem: number;
    license_status: string[];
    lng: number;
    lat: number;
    code: string;
}
