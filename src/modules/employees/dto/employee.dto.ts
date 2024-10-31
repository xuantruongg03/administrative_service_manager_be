export class EmployeeDTO {
    id: string;
    name: string;
    citizen_id: string;
    position: string;
    phone: string;
    start_date: Date;
    created_at: Date;
    updated_at: Date;
}

export class CreateEmployeeDTO {
    citizen_id: string;
    name: string;
    position: string;
    phone: string;
    start_date: Date;
}
