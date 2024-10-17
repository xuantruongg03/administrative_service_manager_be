import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseDate } from 'src/common/format';
import { GeocodingService } from 'src/shared/geocoding.service';
import { ILike, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { BussinessLicensesService } from '../bussiness-licenses/bussiness-licenses.service';
import { EmployeesService } from '../employees/employees.service';
import { LicenseTypeService } from '../license-type/license-type.service';
import { Person } from '../persons/entities/persons.entity';
import { PersonsService } from '../persons/persons.service';
import { TypeOfOrganization } from '../type-of-organizations/entities/type-of-organization.entity';
import { TypeOfOrganizationsService } from '../type-of-organizations/type-of-organizations.service';
import {
    BusinessDTO,
    BusinessInforDTO,
    BusinessMapDTO,
    MapData,
} from './dto/business.dto';
import { Business } from './entities/businesses.entity';
import { Not } from 'typeorm';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly geocodingService: GeocodingService,
        private readonly personsService: PersonsService,
        private readonly typeOfOrganizationService: TypeOfOrganizationsService,
        private readonly employeesService: EmployeesService,
        private readonly businessLicenseService: BussinessLicensesService,
        private readonly licenseTypeService: LicenseTypeService,
    ) {}

    async create(business: Business) {
        const check = await this.checkBusinessData(business);
        if (check) {
            return check;
        }
        return await this.businessRepository.save(business);
    }

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

    private async createRepresentative(data: any): Promise<Person | string> {
        const check = await this.checkPersonData(data);
        if (check) {
            return check;
        }
        const person = new Person();
        person.citizen_id = data['CCCD người đại diện'].toString();
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

    private async createOwner(data: any): Promise<Person | string> {
        const check = await this.checkPersonData(data);
        if (check) {
            return check;
        }
        const person = new Person();
        person.citizen_id = data['CCCD người sở hữu'].toString();
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

    private async createBusiness(data: any): Promise<Business | string> {
        const check = await this.checkBusinessData(data);
        if (check) {
            return check;
        }
        const business = new Business();
        business.code = data['Mã doanh nghiệp'].toString();
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

    private async isBusinessExist(
        code: string,
        name_vietnamese: string,
    ): Promise<boolean> {
        if (!code || !name_vietnamese) {
            throw new Error('Code and Vietnamese name are required');
        }

        try {
            const business = await this.businessRepository.findOne({
                where: { code, name_vietnamese },
            });
            return business !== null && business !== undefined;
        } catch (error) {
            console.error('Error checking business existence:', error);
            throw new Error('Failed to check business existence');
        }
    }

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
            const isExistBusiness = await this.isBusinessExist(
                business.code,
                business.name_vietnamese,
            );
            if (!isExistBusiness) {
                await this.businessRepository.save(business);
            }
        }
    }

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
                    'Trạng thái':
                        business.status === 'active'
                            ? 'Hoạt động'
                            : 'Không hoạt động',
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

    async findOne(code: string): Promise<BusinessInforDTO | null> {
        if (!code || code.trim() === '') {
            return null;
        }
        const business = await this.businessRepository.findOne({
            where: { code },
        });
        const employees =
            await this.employeesService.findAllByBusinessCode(code);
        const number_of_employees = employees.length;
        const representative = await this.personsService.findOne(
            business?.legal_representative,
        );
        const owner = await this.personsService.findOne(business?.owner_id);
        const businessInfo: BusinessInforDTO = {
            code: business?.code,
            name_vietnamese: business?.name_vietnamese,
            name_english: business?.name_english,
            name_acronym: business?.name_acronym,
            address: business?.address,
            phone: business?.phone,
            email: business?.email,
            website: business?.website,
            fax: business?.fax,
            chartered_capital: business?.chartered_capital,
            type_of_organization: business?.type_of_organization,
            status: business?.status,
            legal_representative: representative?.name,
            owner: owner?.name,
            employee: employees,
            number_of_employees,
            created_at: business?.created_at,
        };
        return businessInfo;
    }

    async update(code: string, business: BusinessInforDTO) {
        console.log(business);
        // const rs = await this.businessRepository.update(code, business);
        // return rs;
    }

    async remove(code: string[]) {
        const deletePromises = code.map((c) => {
            this.businessRepository.softDelete(c);
        });
        await Promise.all(deletePromises);
        return true;
    }

    async findAllMap(
        page: number,
        limit: number,
    ): Promise<{
        data: BusinessMapDTO[];
        totalPages: number;
        isLastPage: boolean;
        totalRecords: number;
        currentPage: number;
    }> {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, limit);
        const query = this.businessRepository.createQueryBuilder('business');

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

                const license_status = await this.getLicenseStatus(
                    business.code,
                );
                return {
                    code: business.code,
                    name_vietnamese: business.name_vietnamese,
                    address: business.address,
                    type_of_organization: business.type_of_organization,
                    latitude: business.latitude,
                    longitude: business.longitude,
                    status: business.status,
                    created_at: business.created_at,
                    number_of_employees,
                    license_status,
                };
            }),
        );
        return {
            data,
            totalPages,
            isLastPage,
            totalRecords,
            currentPage: validPage,
        };
    }

    private async getLicenseStatus(business_code: string): Promise<string[]> {
        const licenses =
            await this.businessLicenseService.findOne(business_code);
        //Nếu không có giấy phép thì trả về mảng rỗng
        if (!!licenses) {
            return [
                'Không có giấy phép kinh doanh',
                'Không có giấy phép an ninh trật tự',
            ];
        }
        //Nếu có giấy phép thì kiểm tra loại giấy phép, yêu cầu phải có giấy phép kinh doanh và an ninh trật tự
        //Lấy ra các giấy phép bắt buộc và kiểm tra xem có bị thiếu không
        const mandatoryLicenses = await this.licenseTypeService.findMandatory();
        const missingLicenses = [];
        for (const l of mandatoryLicenses) {
            const license = licenses.find(
                (license) => license.licenseType.name === l.name,
            );
            if (!license) {
                missingLicenses.push(l.name);
            }
        }
    }

    async findAllMapMarker(): Promise<MapData[]> {
        const businesses = await this.businessRepository.find({
            where: [{ longitude: Not(0) }, { latitude: Not(0) }],
        });

        const mapData: Promise<MapData>[] = businesses.map(async (business) => {
            const license_status = await this.getLicenseStatus(business.code);
            const object: MapData = {
                name: business.name_vietnamese,
                address: business.address,
                status: business.status,
                number_of_problem: license_status.length,
                license_status: license_status,
                lng: business.longitude,
                lat: business.latitude,
                code: business.code,
            };
            return object;
        });
        return Promise.all(mapData);
    }
}
