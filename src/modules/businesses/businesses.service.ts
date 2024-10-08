import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import * as XLSX from 'xlsx';
import { Business } from './entities/businesses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeocodingService } from 'src/shared/geocoding.service';
import { Person } from '../persons/entities/persons.entity';
import { PersonsService } from '../persons/persons.service';
import { TypeOfOrganizationsService } from '../type-of-organizations/type-of-organizations.service';
import { TypeOfOrganization } from '../type-of-organizations/entities/type-of-organization.entity';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly geocodingService: GeocodingService,
        private readonly personsService: PersonsService,
        private readonly typeOfOrganizationService: TypeOfOrganizationsService,
    ) {}

    create(createBusinessDto: CreateBusinessDto) {
        return 'This action adds a new business';
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
        person.birth_date = data['Ngày sinh người đại diện'];
        person.gender = data['Giới tính người đại diện'];
        person.nationality = data['Quốc tịch người đại diện'];
        person.religion = data['Dân tộc người đại diện'];
        person.type_of_certificate = data['Loại giấy tờ người đại diện'];
        person.issued_by = data['Nơi cấp người đại diện'];
        person.issued_date = data['Ngày cấp người đại diện'];
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
        person.issued_date = data['Ngày cấp người sở hữu'];
        person.hometown = data['Quê quán người sở hữu'];
        person.current_address = data['Địa chỉ hiện tại người sở hữu'];
        person.birth_date = data['Ngày sinh người sở hữu'];
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
        business.status = data['Trạng thái'] || 'normal';
        const coordinates = await this.geocodingService.getCoordinates(
            business.address,
        );
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
                await this.personsService.checkPersonData(
                    person_representative.citizen_id,
                );
            const isExistOwner = await this.personsService.checkPersonData(
                person_owner.citizen_id,
            );

            // if not exist, create new person
            if (isExistRepresentative === null) {
                this.personsService.create(person_representative);
            }
            if (isExistOwner === null) {
                this.personsService.create(person_owner);
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

    findAll() {
        return `This action returns all businesses`;
    }

    findOne(id: number) {
        return `This action returns a #${id} business`;
    }

    update(id: number, updateBusinessDto: UpdateBusinessDto) {
        return `This action updates a #${id} business`;
    }

    remove(id: number) {
        return `This action removes a #${id} business`;
    }
}
