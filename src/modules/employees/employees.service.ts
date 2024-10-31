import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CONSTANTS from 'src/common/constants';
import { parseDate } from 'src/common/format';
import REGEX from 'src/common/regex';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { BusinessesService } from '../businesses/businesses.service';
import { PersonsService } from '../persons/persons.service';
import { CreateEmployeeDTO, EmployeeDTO } from './dto/employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        @Inject(forwardRef(() => PersonsService))
        private readonly personsService: PersonsService,
        @Inject(forwardRef(() => BusinessesService))
        private readonly businessesService: BusinessesService,
    ) {}

    async findAllByBusinessCode(businessCode: string): Promise<EmployeeDTO[]> {
        const employees = await this.employeeRepository.find({
            where: { business_code: businessCode },
        });
        return employees.map((employee) => ({
            id: employee.id,
            citizen_id: employee.citizen_id,
            name: employee.name,
            position: employee.position,
            phone: employee.phone,
            start_date: employee.start_date,
            created_at: employee.created_at,
            updated_at: employee.updated_at,
        }));
    }

    async findAllByBusinessCodeWithPagination(
        businessCode: string,
        page: number,
        limit: number,
    ): Promise<{
        data: EmployeeDTO[];
        totalPages: number;
        isLastPage: boolean;
        totalRecords: number;
    }> {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, limit);
        const [employees, totalRecords] =
            await this.employeeRepository.findAndCount({
                where: { business_code: businessCode },
                skip: (validPage - 1) * validLimit,
                take: validLimit,
            });
        const data = employees.map((employee) => ({
            id: employee.id,
            citizen_id: employee.citizen_id,
            name: employee.name,
            position: employee.position,
            phone: employee.phone,
            start_date: employee.start_date,
            created_at: employee.created_at,
            updated_at: employee.updated_at,
        }));
        const totalPages = Math.ceil(totalRecords / limit);
        const isLastPage = page === totalPages;
        return { data, totalPages, isLastPage, totalRecords };
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
            where: {
                citizen_id: citizenId,
                business_code: businessCode,
            },
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
        if (!data['Ngày vào làm']) {
            return 'Ngày vào làm là bắt buộc';
        }
        if (!data['Chức vụ']) {
            return 'Chức vụ là bắt buộc';
        }
        if (!data['Số điện thoại']) {
            return 'Số điện thoại là bắt buộc';
        }
        //Check phone number
        if (!REGEX.PHONE_NUMBER.test(data['Số điện thoại'])) {
            return 'Số điện thoại không hợp lệ';
        }
        //Check citizen id
        if (!REGEX.CITIZEN_ID.test(data['Số CCCD'])) {
            return 'Số CCCD không hợp lệ';
        }
        return null;
    }
    async createPersonByExcel(file: Express.Multer.File, businessCode: string) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        // Xử lý dữ liệu từ file Excel
        for (const row of data) {
            const error = await this.checkData(row);
            if (error) {
                return error;
            }
            const employee = new Employee();
            employee.id = await this.generateId();
            employee.citizen_id = row['Số CCCD'];
            employee.name = row['Họ tên'];
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

    async getEmployeeInfo(businessCode: string) {
        const employees = await this.findAllByBusinessCode(businessCode);
        return employees;
    }

    async getEmployeeInfoWithPagination(
        businessCode: string,
        page: number,
        limit: number,
    ) {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, limit);
        const employees = await this.findAllByBusinessCodeWithPagination(
            businessCode,
            validPage,
            validLimit,
        );
        return employees;
    }

    async createEmployee(businessCode: string, body: any) {
        const employee = new Employee();
        employee.id = await this.generateId();
        employee.citizen_id = body.citizen_id;
        employee.business_code = businessCode;
        employee.name = body.name;
        employee.position = body.position;
        employee.phone = body.phone;
        employee.start_date = parseDate(body.start_date);
        const isExist = await this.isEmployeeExist(
            employee.citizen_id,
            employee.business_code,
        );
        if (isExist) {
            return 'Employee already exists';
        }
        await this.employeeRepository.save(employee);
        return true;
    }

    async deleteEmployee(citizen_id: string) {
        try {
            await this.employeeRepository.delete({ citizen_id });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateEmployee(
        businessCode: string,
        citizen_id: string,
        body: CreateEmployeeDTO,
    ) {
        const data = {
            citizen_id: body.citizen_id,
            business_code: businessCode,
            name: body.name,
            position: body.position,
            phone: body.phone,
            start_date: parseDate(body.start_date.toString()),
        };
        try {
            await this.employeeRepository.update(
                { citizen_id, business_code: businessCode },
                data,
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
