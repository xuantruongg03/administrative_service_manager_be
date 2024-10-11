import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Person } from '../persons/entities/persons.entity';
import { PersonsService } from '../persons/persons.service';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        private readonly personsService: PersonsService,
        // private readonly generateIdService: GenerateIdService,
    ) {}

    findAllByBusinessCode(businessCode: string) {
        return this.employeeRepository.find({
            where: { business_code: businessCode },
        });
    }

    async createPersonByExcel(
        file: Express.Multer.File,
        query: { businessCode: string },
    ) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Xử lý dữ liệu từ file Excel
        for (const row of data) {
            const person = new Person();
            person.citizen_id = row['Mã CCCD'];
            person.name = row['Tên'];
            person.gender = row['Giới tính'];
            person.current_address = row['Địa chỉ hiện tại'];
            person.type_of_certificate = row['Loại giấy tờ'];
            person.issued_by = row['Nơi cấp'];
            person.issued_date = row['Ngày cấp'];
            person.hometown = row['Quê quán'];
            person.religion = row['Tôn giáo'];
            person.birth_date = row['Ngày sinh'];
            person.nationality = row['Quốc tịch'];
            person.created_at = new Date();
            person.updated_at = new Date();
            // await this.personRepository.save(person);
            console.log(person);

            const employee = new Employee();
            employee.citizen_id = person.citizen_id;
            employee.business_code = query.businessCode;
            employee.created_at = new Date();
            employee.updated_at = new Date();
            // await this.employeeRepository.save(employee);
            console.log(employee);
        }
        return { message: 'Success' };
    }
}
