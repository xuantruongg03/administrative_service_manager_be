import { BusinessLicenseDto } from 'src/modules/bussiness-licenses/dto/business-license.dto';

export class BusinessDTO {
    id: string;
    code: string;
    name_vietnamese: string;
    status: string;
    created_at: Date;
    phone: string;
    address: string;
    licenses: string[];
}

export class PersonForBusinessDTO {
    id: string;
    citizen_id: string;
    name: string;
    birth_date: string;
    gender: string;
    nationality: string;
    religion: string;
    type_of_certificate: string;
    issued_by: string;
    issued_date: string;
    hometown: string;
    current_address: string;
    created_at: string;
}

export class BusinessInforDTO {
    id: string;
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
    owner: PersonForBusinessDTO;
    legal_representative: PersonForBusinessDTO;
    number_of_employees: number;
    created_at: string;
    status: string;
    licenses: BusinessLicenseDto[];
    latitude: number;
    longitude: number;
}

export class BusinessMapDTO {
    id: string;
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
    id: string;
    name: string;
    address: string;
    status: string;
    number_of_problem: number;
    license_status: string[];
    lng: number;
    lat: number;
    code: string;
    type_of_organization: string;
    id_type_of_organization: string;
}
