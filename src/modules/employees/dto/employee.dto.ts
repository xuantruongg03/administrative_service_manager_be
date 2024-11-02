export class EmployeeDTO {
    id: string;
    citizen_id: string;
    name: string;
    position: string;
    phone: string;
    start_date: Date;
    created_at: Date;
    updated_at: Date;
}

export class CreateEmployeeDTO {
    citizen_id: string;
    employee_id: string;
    name: string;
    position: string;
    phone: string;
    start_date: Date;
}
