import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Person } from '../persons/entities/persons.entity';
import { PersonsService } from '../persons/persons.service';
import { Employee } from './entities/employee.entity';
import { parseDate } from 'src/common/format';
import CONSTANTS from 'src/common/constants';
import { EmployeeDTO } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        private readonly personsService: PersonsService,
    ) { }

    async findAllByBusinessCode(businessCode: string): Promise<EmployeeDTO[]> {
        const employees = await this.employeeRepository.find({
            where: { business_code: businessCode },
            relations: ['person'],
        });
        return employees.map((employee) => ({
            id: employee.id,
            citizen_id: employee.citizen_id,
            name: employee.person.name,
            position: employee.position,
            phone: employee.phone,
            start_date: employee.start_date,
        }));
    }

    async generateId() {
        const id = Math.random()
            .toString(36)
            .substring(2, CONSTANTS.LENGTH_ID + 2);
        const isExist = await this.employeeRepository.findOne({
            where: { id: id },
        });
        if (isExist) {
            return this.generateId();
        }
        return id;
    }

    async isEmployeeExist(
        citizenId: string,
        businessCode: string,
    ): Promise<boolean> {
        const employee = await this.employeeRepository.findOne({
            where: { citizen_id: citizenId, business_code: businessCode },
        });
        return !!employee;
    }

    private async checkData(data: any): Promise<string | null> {
        if (!data['Họ tên']) {
            return 'Họ tên là bắt buộc';
        }
        if (!data['Số CCCD']) {
            return 'Số CCCD là bắt buộc';
        }
        if (!data['Loại giấy tờ']) {
            return 'Loại giấy tờ là bắt buộc';
        }
        if (!data['Nơi cấp']) {
            return 'Nơi cấp là bắt buộc';
        }
        if (!data['Ngày cấp']) {
            return 'Ngày cấp là bắt buộc';
        }
        if (!data['Ngày sinh']) {
            return 'Ngày sinh là bắt buộc';
        }
        if (!data['Giới tính']) {
            return 'Giới tính là bắt buộc';
        }
        if (!data['Quốc tịch']) {
            return 'Quốc tịch là bắt buộc';
        }
        if (!data['Dân tộc']) {
            return 'Dân tộc là bắt buộc';
        }
        if (!data['Ngày vào làm']) {
            return 'Ngày vào làm là bắt buộc';
        }
        if (!data['Chức vụ']) {
            return 'Chức vụ là bắt buộc';
        }
        return null;
    }

    private async createPerson(data: any): Promise<Person | string> {
        const check = await this.checkData(data);
        if (check) {
            return check;
        }
        const person = new Person();
        person.citizen_id = data['Số CCCD'].toString();
        person.name = data['Họ tên'];
        person.birth_date = parseDate(data['Ngày sinh']);
        person.gender = data['Giới tính'];
        person.nationality = data['Quốc tịch'];
        person.religion = data['Dân tộc'];
        person.type_of_certificate = data['Loại giấy tờ'];
        person.issued_by = data['Nơi cấp'];
        person.issued_date = parseDate(data['Ngày cấp']);
        person.hometown = data['Quê quán'];
        person.current_address = data['Địa chỉ hiện tại'];
        return person;
    }

    async createPersonByExcel(file: Express.Multer.File, businessCode: string) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        // Xử lý dữ liệu từ file Excel
        for (const row of data) {
            const person = await this.createPerson(row);
            if (typeof person === 'string') {
                return person;
            }
            const isExist = await this.personsService.isPersonExist(
                person.citizen_id,
            );
            if (!isExist) {
                await this.personsService.create(person);
            }

            const employee = new Employee();
            employee.id = await this.generateId();
            employee.citizen_id = person.citizen_id;
            employee.business_code = businessCode;
            employee.position = row['Chức vụ'];
            employee.phone = row['Số điện thoại'];
            employee.start_date = parseDate(row['Ngày vào làm'] || '');
            employee.created_at = new Date();
            employee.updated_at = new Date();
            const isExistEmployee = await this.isEmployeeExist(
                employee.citizen_id,
                employee.business_code,
            );
            if (!isExistEmployee) {
                await this.employeeRepository.save(employee);
            }
        }
    }
}
