import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseDate } from 'src/common/format';
import { GeocodingService } from 'src/shared/geocoding.service';
import { ILike, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { EmployeesService } from '../employees/employees.service';
import { Person } from '../persons/entities/persons.entity';
import { PersonsService } from '../persons/persons.service';
import { TypeOfOrganization } from '../type-of-organizations/entities/type-of-organization.entity';
import { TypeOfOrganizationsService } from '../type-of-organizations/type-of-organizations.service';
import { BusinessDTO, BusinessWithEmployeesDTO } from './dto/business.dto';
import { Business } from './entities/businesses.entity';
import { return_success } from 'src/common/return';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly geocodingService: GeocodingService,
        private readonly personsService: PersonsService,
        private readonly typeOfOrganizationService: TypeOfOrganizationsService,
        private readonly employeesService: EmployeesService,
    ) {}

    async create(business: Business) {
        const check = await this.checkBusinessData(business);
        if (check) {
            return check;
        }
        return await this.businessRepository.save(business);
    }

    /**
     * The function `checkBusinessData` in TypeScript checks if certain fields are present in the
     * provided data object and returns an error message if any required field is missing.
     * @param {any} data - The `checkBusinessData` function is designed to validate business data. It
     * checks if certain fields in the `data` object are present or not. Here are the required fields
     * that the function checks for:
     * @returns The `checkBusinessData` function is returning a string message if any of the required
     * fields are missing in the `data` object. If all required fields are present, it returns `null`.
     */
    private async checkBusinessData(data: any): Promise<string | null> {
        if (!data['Mã doanh nghiệp'] || !data['Tên doanh nghiệp (VN)']) {
            return 'Mã doanh nghiệp và tên doanh nghiệp (VN) là bắt buộc';
        }
        if (!data['Địa chỉ'] || !data['Số điện thoại']) {
            return 'Địa chỉ và số điện thoại là bắt buộc';
        }
        if (!data['Loại hình doanh nghiệp']) {
            return 'Loại hình doanh nghiệp là bắt buộc';
        }
        if (data['Loại hình doanh nghiệp']) {
            const type_of_organization = data['Loại hình doanh nghiệp'];
            const typeOfOrganization =
                await this.typeOfOrganizationService.findByName(
                    type_of_organization,
                );
            if (typeOfOrganization === null) {
                return 'Loại hình doanh nghiệp không tồn tại';
            }
        }
        if (!data['Vốn điều lệ']) {
            return 'Vốn điều lệ là bắt buộc';
        }
        return null;
    }

    /**
     * The function `checkPersonData` in TypeScript validates the presence of required personal data
     * fields for representative and owner persons.
     * @param {any} data - The `checkPersonData` function is checking the provided `data` object for
     * various required fields related to two individuals - a representative and an owner. Here are the
     * parameters that are being checked for each individual:
     * @returns The function `checkPersonData` is checking if certain fields in the `data` object are
     * missing. If any of the required fields are missing for either the representative person or the
     * owner person, a corresponding error message is returned. If all required fields are present for
     * both the representative person and the owner person, `null` is returned, indicating that the
     * data is valid.
     */
    private async checkPersonData(data: any): Promise<string | null> {
        if (!data['Tên người đại diện'] || !data['Tên người sở hữu']) {
            return 'Tên người đại diện và tên người sở hữu là bắt buộc';
        }
        if (!data['CCCD người đại diện'] || !data['CCCD người sở hữu']) {
            return 'CCCD người đại diện và CCCD người sở hữu là bắt buộc';
        }
        if (
            !data['Loại giấy tờ người đại diện'] ||
            !data['Loại giấy tờ người sở hữu']
        ) {
            return 'Loại giấy tờ người đại diện và loại giấy tờ người sở hữu là bắt buộc';
        }
        if (!data['Nơi cấp người đại diện'] || !data['Nơi cấp người sở hữu']) {
            return 'Nơi cấp là bắt buộc';
        }
        if (
            !data['Ngày cấp người đại diện'] ||
            !data['Ngày cấp người sở hữu']
        ) {
            return 'Ngày cấp là bắt buộc';
        }
        if (
            !data['Ngày sinh người đại diện'] ||
            !data['Ngày sinh người sở hữu']
        ) {
            return 'Ngày sinh là bắt buộc';
        }
        if (
            !data['Giới tính người đại diện'] ||
            !data['Giới tính người sở hữu']
        ) {
            return 'Giới tính là bắt buộc';
        }
        if (
            !data['Quốc tịch người đại diện'] ||
            !data['Quốc tịch người sở hữu']
        ) {
            return 'Quốc tịch là bắt buộc';
        }
        if (!data['Dân tộc người đại diện'] || !data['Dân tộc người sở hữu']) {
            return 'Dân tộc là bắt buộc';
        }
        return null;
    }

    /**
     * The function `createRepresentative` creates a new `Person` object with data provided and returns
     * it, or a string if there is an error.
     * @param {any} data - The `data` parameter in the `createRepresentative` function seems to contain
     * information about a person who is being created as a representative. The function is extracting
     * various details such as citizen ID, name, type of certificate, issued by, issued date, hometown,
     * current address, birth date, gender
     * @returns The `createRepresentative` function is returning either an instance of the `Person`
     * class with the populated data fields based on the input `data`, or a string if there is an error
     * during the data validation process.
     */
    private async createRepresentative(data: any): Promise<Person | string> {
        const check = await this.checkPersonData(data);
        if (check) {
            return check;
        }
        const person = new Person();
        person.citizen_id = data['CCCD người đại diện'];
        person.name = data['Tên người đại diện'];
        person.birth_date = parseDate(data['Ngày sinh người đại diện']);
        person.gender = data['Giới tính người đại diện'];
        person.nationality = data['Quốc tịch người đại diện'];
        person.religion = data['Dân tộc người đại diện'];
        person.type_of_certificate = data['Loại giấy tờ người đại diện'];
        person.issued_by = data['Nơi cấp người đại diện'];
        person.issued_date = parseDate(data['Ngày cấp người đại diện']);
        person.hometown = data['Quê quán người đại diện'];
        person.current_address = data['Địa chỉ hiện tại người đại diện'];
        return person;
    }

    /**
     * The function `createOwner` creates a new `Person` object with data provided and returns it, or
     * returns a string if there is an issue with the data.
     * @param {any} data - The `createOwner` function is an asynchronous function that takes in a
     * `data` object as a parameter. The `data` object contains information about a person who is being
     * created as an owner. The function first checks the validity of the person data using the
     * `checkPersonData` function. If
     * @returns The `createOwner` function is returning either an instance of the `Person` class with
     * the provided data assigned to its properties, or a string if there is an issue with the data
     * validation during the `checkPersonData` step.
     */
    private async createOwner(data: any): Promise<Person | string> {
        const check = await this.checkPersonData(data);
        if (check) {
            return check;
        }
        const person = new Person();
        person.citizen_id = data['CCCD người sở hữu'];
        person.name = data['Tên người sở hữu'];
        person.type_of_certificate = data['Loại giấy tờ người sở hữu'];
        person.issued_by = data['Nơi cấp người sở hữu'];
        person.issued_date = parseDate(data['Ngày cấp người sở hữu']);
        person.hometown = data['Quê quán người sở hữu'];
        person.current_address = data['Địa chỉ hiện tại người sở hữu'];
        person.birth_date = parseDate(data['Ngày sinh người sở hữu']);
        person.gender = data['Giới tính người sở hữu'];
        person.nationality = data['Quốc tịch người sở hữu'];
        person.religion = data['Dân tộc người sở hữu'];
        return person;
    }

    /**
     * The function `createBusiness` creates a new Business object with data provided, performs data
     * validation, and retrieves coordinates for the business address using geocoding service.
     * @param {any} data - The `data` parameter in the `createBusiness` method seems to contain information
     * about a business entity. It includes various properties such as the business code, name in
     * Vietnamese and English, address, phone number, email, website, fax, chartered capital, type of
     * organization, legal representative, owner
     * @returns The `createBusiness` method returns either an instance of the `Business` class with
     * populated data fields or a string if there is an error during the data validation process.
     */
    private async createBusiness(data: any): Promise<Business | string> {
        const check = await this.checkBusinessData(data);
        if (check) {
            return check;
        }
        const business = new Business();
        business.code = data['Mã doanh nghiệp'];
        business.name_vietnamese = data['Tên doanh nghiệp (VN)'];
        business.name_english = data['Tên doanh nghiệp (EN)'] || '';
        business.name_acronym = data['Tên viết tắt'];
        business.address = data['Địa chỉ'];
        business.phone = data['Số điện thoại'];
        business.email = data['Email'] || '';
        business.website = data['Website'] || '';
        business.fax = data['Fax'] || '';
        business.chartered_capital = data['Vốn điều lệ'];
        business.type_of_organization = await this.typeOfOrganizationService
            .findByName(data['Loại hình doanh nghiệp'])
            .then((type: TypeOfOrganization) => {
                return type.id;
            });
        business.legal_representative = data['CCCD người đại diện'];
        business.owner_id = data['CCCD người sở hữu'];
        business.status =
            data['Trạng thái'] === 'Hoạt động' ? 'active' : 'inactive';
        const coordinates = await this.geocodingService.getCoordinates(
            business.address,
        );
        console.log(coordinates);
        business.latitude = coordinates.latitude;
        business.longitude = coordinates.longitude;
        return business;
    }

    /**
     * The function `checkBusinessExist` asynchronously checks if a business with a specific code and
     * Vietnamese name exists in the database and returns the business if found, otherwise returns
     * null.
     * @param {string} code - A unique identifier for a business.
     * @param {string} name_vietnamese - The parameter `name_vietnamese` is a string representing the
     * Vietnamese name of a business.
     * @returns The `checkBusinessExist` function is returning a Promise that resolves to either a
     * `Business` object if found in the database based on the provided `code` and `name_vietnamese`,
     * or `null` if no matching business is found.
     */
    private async checkBusinessExist(
        code: string,
        name_vietnamese: string,
    ): Promise<Business | null> {
        const business = await this.businessRepository.findOne({
            where: { code, name_vietnamese },
        });
        return business || null;
    }

    /**
     * This TypeScript function reads data from an Excel file, creates business entities,
     * representative entities, and owner entities, and checks for existing data before saving new
     * entries.
     * @param file - The `file` parameter in the `createBusinessByExcel` function is of type
     * `Express.Multer.File`, which is a file object containing information about the uploaded file.
     * This parameter is used to read the Excel file data and process it to create business,
     * representative, and owner entities based on
     * @returns If any of the checks for invalid data or existing records fail during the creation
     * process, a string error message is returned. Otherwise, the function continues to create
     * business entities, representatives, owners, and persons as needed.
     */
    async createBusinessByExcel(file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        for (const row of data) {
            //create business and check invalid data
            const business = await this.createBusiness(row);
            if (typeof business === 'string') {
                return business;
            }
            //create representative and check invalid data
            const person_representative = await this.createRepresentative(row);
            if (typeof person_representative === 'string') {
                return person_representative;
            }
            //create owner and check invalid data
            const person_owner = await this.createOwner(row);
            if (typeof person_owner === 'string') {
                return person_owner;
            }
            //check exist representative and owner
            const isExistRepresentative =
                await this.personsService.isPersonExist(
                    person_representative.citizen_id,
                );

            if (!isExistRepresentative) {
                await this.personsService.create(person_representative);
            }
            const isExistOwner = await this.personsService.isPersonExist(
                person_owner.citizen_id,
            );
            // Create owner if not exists
            if (!isExistOwner) {
                await this.personsService.create(person_owner);
            }
            //check exist business
            const isExistBusiness = await this.checkBusinessExist(
                business.code,
                business.name_vietnamese,
            );
            if (isExistBusiness === null) {
                await this.businessRepository.save(business);
            }
        }
    }

    /**
     * This TypeScript function asynchronously retrieves a specified number of business entities based
     * on the provided page and limit parameters.
     * @param {number} page - The `page` parameter represents the page number of the results you want
     * to retrieve.
     * @param {number} limit - The `limit` parameter specifies the maximum number of items to retrieve
     * in a single page or query. It determines the number of results that will be returned by the
     * `findAll` method.
     * @returns The `findAll` method is returning a list of business entities based on the provided
     * `page` and `limit` parameters. The method queries the business repository to find entities with
     * pagination parameters calculated based on the input `page` and `limit` values.
     */
    async findAll(
        page: number,
        limit: number,
        keyword: string,
    ): Promise<{
        data: BusinessDTO[];
        totalPages: number;
        isLastPage: boolean;
        totalRecords: number;
    }> {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, limit);
        let query = this.businessRepository.createQueryBuilder('business');
        if (keyword && keyword.trim() !== '') {
            query = query.where([
                { name_vietnamese: ILike(`%${keyword}%`) },
                { name_english: ILike(`%${keyword}%`) },
                { name_acronym: ILike(`%${keyword}%`) },
                { address: ILike(`%${keyword}%`) },
                { code: ILike(`%${keyword}%`) },
            ]);
        }

        const [rs, totalRecords] = await query
            .skip((validPage - 1) * validLimit)
            .take(validLimit)
            .getManyAndCount();

        const totalPages = Math.ceil(totalRecords / validLimit);
        const isLastPage = totalRecords <= validPage * validLimit;

        const data = await Promise.all(
            rs.map(async (business) => {
                const employee_of_business =
                    await this.employeesService.findAllByBusinessCode(
                        business.code,
                    );
                const number_of_employees = employee_of_business.length;
                return { ...business, number_of_employees };
            }),
        );
        return { data, totalPages, isLastPage, totalRecords };
    }

    /**
     * The function `exportBusinessToExcel` retrieves business data, transforms it into an Excel workbook,
     * and returns the workbook buffer along with a generated file name.
     * @returns The `exportBusinessToExcel` method returns an object with two properties:
     * 1. `buffer`: A buffer containing the Excel file data.
     * 2. `fileName`: A string representing the file name for the exported Excel file, which includes the
     * current timestamp in ISO format.
     */
    async exportBusinessToExcel() {
        const businesses = await this.businessRepository.find();
        const workbook = XLSX.utils.book_new();
        const worksheetData = await Promise.all(
            businesses.map(async (business) => {
                const representative = await this.personsService.findOne(
                    business.legal_representative,
                );
                const owner = await this.personsService.findOne(
                    business.owner_id,
                );
                const type_of_organization =
                    await this.typeOfOrganizationService.findOne(
                        business.type_of_organization,
                    );
                return {
                    'Mã doanh nghiệp': business.code,
                    'Tên doanh nghiệp (VN)': business.name_vietnamese,
                    'Tên doanh nghiệp (EN)': business.name_english,
                    'Tên viết tắt': business.name_acronym,
                    'Địa chỉ': business.address,
                    'Số điện thoại': business.phone,
                    'Địa chỉ email': business.email,
                    Website: business.website,
                    Fax: business.fax,
                    'Vốn điều lệ': business.chartered_capital,
                    'Loại hình doanh nghiệp': type_of_organization.name,
                    'Trạng thái': business.status,
                    'Tên người đại diện': representative.name,
                    'CCCD người đại diện': representative.citizen_id,
                    'Loại giấy tờ người đại diện':
                        representative.type_of_certificate,
                    'Nơi cấp người đại diện': representative.issued_by,
                    'Ngày cấp người đại diện': representative.issued_date,
                    'Quê quán người đại diện': representative.hometown,
                    'Địa chỉ hiện tại người đại diện':
                        representative.current_address,
                    'Ngày sinh người đại diện': representative?.birth_date,
                    'Giới tính người đại diện': representative.gender,
                    'Quốc tịch người đại diện': representative.nationality,
                    'Dân tộc người đại diện': representative.religion,
                    'Tên người sở hữu': owner.name,
                    'CCCD người sở hữu': owner.citizen_id,
                    'Loại giấy tờ người sở hữu': owner.type_of_certificate,
                    'Nơi cấp người sở hữu': owner.issued_by,
                    'Ngày cấp người sở hữu': owner.issued_date,
                    'Quê quán người sở hữu': owner.hometown,
                    'Địa chỉ hiện tại người sở hữu': owner.current_address,
                    'Ngày sinh người sở hữu': owner.birth_date,
                    'Giới tính người sở hữu': owner.gender,
                    'Quốc tịch người sở hữu': owner.nationality,
                    'Dân tộc người sở hữu': owner.religion,
                };
            }),
        );
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Doanh nghiệp');
        const excelBuffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
        });
        const fileName = `businesses_export_${new Date().toISOString()}.xlsx`;

        return {
            buffer: excelBuffer,
            fileName: fileName,
        };
    }

    async findOne(code: string): Promise<BusinessWithEmployeesDTO | null> {
        const rs = await this.businessRepository.findOne({
            where: { code },
        });
        const employees =
            await this.employeesService.findAllByBusinessCode(code);
        const number_of_employees = employees.length;
        const businessWithEmployees = { ...rs, employees, number_of_employees };
        return businessWithEmployees;
    }

    async update(code: string, business: Business) {
        const rs = await this.businessRepository.update(code, business);
        return rs;
    }

    remove(code: string[]) {
        code.map((c) => {
            this.businessRepository.softDelete(c);
        });
        return return_success('Xóa doanh nghiệp thành công');
    }
}
