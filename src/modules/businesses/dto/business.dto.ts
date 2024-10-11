import { Employee } from 'src/modules/employees/entities/employee.entity';

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

export class BusinessWithEmployeesDTO extends BusinessDTO {
    employees: Employee[];
}
