import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CONSTANTS from 'src/common/constants';
import { parseDate } from 'src/common/format';
import { GeocodingService } from 'src/shared/geocoding.service';
import { ILike, Not, Repository } from 'typeorm';
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

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly geocodingService: GeocodingService,
        @Inject(forwardRef(() => PersonsService))
        private readonly personsService: PersonsService,
        private readonly typeOfOrganizationsService: TypeOfOrganizationsService,
        @Inject(forwardRef(() => EmployeesService))
        private readonly employeesService: EmployeesService,
        @Inject(forwardRef(() => BussinessLicensesService))
        private readonly businessLicensesService: BussinessLicensesService,
        private readonly licenseTypeService: LicenseTypeService,
    ) {}

    public async generateId() {
        const id = Math.random()
            .toString(36)
            .substring(2, CONSTANTS.LENGTH_ID + 2);
        const isExist = await this.businessRepository.findOne({
            where: { id: id },
        });
        if (isExist) {
            return this.generateId();
        }
        return id;
    }

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
                await this.typeOfOrganizationsService.findByName(
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
        person.id = await this.personsService.generateId();
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
        person.id = await this.personsService.generateId();
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
        business.id = await this.generateId();
        business.code = data['Mã doanh nghiệp'].toString();
        business.name_vietnamese = data['Tên doanh nghiệp (VN)'];
        business.name_english = data['Tên doanh nghiệp (EN)'] || '';
        business.name_acronym = data['Tên viết tắt'];
        business.address = data['Địa chỉ'];
        business.phone = data['Số điện thoại'];
        business.email = data['Email'] || '';
        business.website = data['Website'] || '';
        business.created_at = parseDate(data['Ngày đăng ký']);
        business.fax = data['Fax'] || '';
        business.chartered_capital = data['Vốn điều lệ'];
        business.type_of_organization = await this.typeOfOrganizationsService
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
        business.latitude = coordinates.latitude;
        business.longitude = coordinates.longitude;
        return business;
    }

    private async isBusinessExist(
        id: string,
        code: string,
        name_vietnamese: string,
    ): Promise<boolean> {
        if (!code || !name_vietnamese) {
            throw new Error('Code and Vietnamese name are required');
        }

        try {
            const business = await this.businessRepository.findOne({
                where: { code, name_vietnamese, id },
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
            // Create business and check invalid data
            const business = await this.createBusiness(row);
            if (typeof business === 'string') {
                return business;
            }

            // Create representative and check invalid data
            const person_representative = await this.createRepresentative(row);
            if (typeof person_representative === 'string') {
                return person_representative;
            }

            // Create owner and check invalid data
            const person_owner = await this.createOwner(row);
            if (typeof person_owner === 'string') {
                return person_owner;
            }

            // Check and create representative
            const existingRepresentative =
                await this.personsService.findByCitizenId(
                    person_representative.citizen_id,
                );

            let legal_representative_id;
            if (!existingRepresentative) {
                const savedRepresentative = await this.personsService.create(
                    person_representative,
                );
                legal_representative_id = savedRepresentative.id;
            } else {
                legal_representative_id = existingRepresentative.id;
            }

            // Check and create owner
            const existingOwner = await this.personsService.findByCitizenId(
                person_owner.citizen_id,
            );

            let owner_id;
            if (!existingOwner) {
                const savedOwner =
                    await this.personsService.create(person_owner);
                owner_id = savedOwner.id;
            } else {
                owner_id = existingOwner.id;
            }

            // Check if business exists
            const isExistBusiness = await this.isBusinessExist(
                business.id,
                business.code,
                business.name_vietnamese,
            );

            if (!isExistBusiness) {
                business.legal_representative = legal_representative_id;
                business.owner_id = owner_id;
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

        try {
            let [rs, totalRecords] = await this.businessRepository.findAndCount(
                {
                    skip: (validPage - 1) * validLimit,
                    take: validLimit,
                    order: {
                        created_at: 'DESC',
                    },
                },
            );
            // Nếu có keyword thì mới thêm điều kiện tìm kiếm
            if (keyword && keyword.trim() !== '') {
                const [filteredRs, filteredTotal] =
                    await this.businessRepository.findAndCount({
                        where: [
                            { name_vietnamese: ILike(`%${keyword}%`) },
                            { name_english: ILike(`%${keyword}%`) },
                            { name_acronym: ILike(`%${keyword}%`) },
                            { address: ILike(`%${keyword}%`) },
                            { code: ILike(`%${keyword}%`) },
                        ],
                        skip: (validPage - 1) * validLimit,
                        take: validLimit,
                        order: {
                            created_at: 'DESC',
                        },
                    });
                rs = filteredRs;
                totalRecords = filteredTotal;
            }

            const totalPages = Math.ceil(totalRecords / validLimit);
            const isLastPage = totalRecords <= validPage * validLimit;

            const data = await Promise.all(
                rs.map(async (business) => {
                    const licenses = await this.businessLicensesService.findOne(
                        business.id,
                    );
                    return {
                        id: business.id,
                        code: business.code,
                        name_vietnamese: business.name_vietnamese,
                        status: business.status,
                        created_at: business.created_at,
                        phone: business.phone,
                        address: business.address,
                        licenses: licenses.map((license) => license.type),
                    };
                }),
            );

            return { data, totalPages, isLastPage, totalRecords };
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    async exportBusinessToExcel() {
        const businesses = await this.businessRepository.find();
        const workbook = XLSX.utils.book_new();
        const worksheetData = await Promise.all(
            businesses.map(async (business) => {
                const representative =
                    await this.personsService.findByCitizenId(
                        business.legal_representative,
                    );
                const owner = await this.personsService.findByCitizenId(
                    business.owner_id,
                );
                const type_of_organization =
                    await this.typeOfOrganizationsService.findOne(
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

    async findOne(id: string): Promise<BusinessInforDTO | null> {
        if (!id || id.trim() === '') {
            return null;
        }
        const business = await this.businessRepository.findOne({
            where: { id },
        });

        if (!business) {
            return null;
        }

        const representative = await this.personsService.findOne(
            business.legal_representative,
        );
        const owner = await this.personsService.findOne(business.owner_id);
        const employees = await this.employeesService.findAllByBusinessId(
            business.id,
        );
        const number_of_employees = employees.length;

        const licenses = await this.businessLicensesService.findOne(
            business.id,
        );

        const businessInfo: BusinessInforDTO = {
            id: business.id,
            code: business.code,
            name_vietnamese: business.name_vietnamese,
            name_english: business.name_english,
            name_acronym: business.name_acronym,
            address: business.address,
            phone: business.phone,
            email: business.email,
            website: business.website,
            fax: business.fax,
            chartered_capital: business.chartered_capital,
            type_of_organization: business.type_of_organization,
            status: business.status,
            number_of_employees,
            latitude: business.latitude,
            longitude: business.longitude,
            legal_representative: {
                id: representative.id,
                citizen_id: representative.citizen_id,
                name: representative.name,
                birth_date: representative.birth_date.toString(),
                gender: representative.gender,
                nationality: representative.nationality,
                religion: representative.religion,
                type_of_certificate: representative.type_of_certificate,
                issued_by: representative.issued_by,
                issued_date: representative.issued_date.toString(),
                hometown: representative.hometown,
                current_address: representative.current_address,
                created_at: representative.created_at.toString(),
            },
            owner: {
                id: owner.id,
                citizen_id: owner.citizen_id,
                name: owner.name,
                birth_date: owner.birth_date.toString(),
                gender: owner.gender,
                nationality: owner.nationality,
                religion: owner.religion,
                type_of_certificate: owner.type_of_certificate,
                issued_by: owner.issued_by,
                issued_date: owner.issued_date.toString(),
                hometown: owner.hometown,
                current_address: owner.current_address,
                created_at: owner.created_at.toString(),
            },
            created_at: business.created_at.toString(),
            licenses,
        };
        return businessInfo;
    }

    async update(id: string, business: BusinessInforDTO) {
        try {
            const businessToUpdate = await this.businessRepository.findOne({
                where: { id },
            });
            if (!businessToUpdate) {
                return 'Business not found';
            }

            // Find persons by citizen_id first
            const representative = await this.personsService.findOne(
                business.legal_representative.id,
            );
            const owner = await this.personsService.findOne(business.owner.id);
            if (!representative || !owner) {
                return 'Representative or owner not found';
            }

            // Update business with person IDs
            businessToUpdate.legal_representative = representative.id;
            businessToUpdate.owner_id = owner.id;

            // Update coordinates if address changed
            if (business.address !== businessToUpdate.address) {
                console.log('Address changed');
                const coordinates = await this.geocodingService.getCoordinates(
                    business.address,
                );
                businessToUpdate.latitude = coordinates.latitude;
                businessToUpdate.longitude = coordinates.longitude;
            }

            // Update business fields
            Object.assign(businessToUpdate, {
                id: business.id,
                code: business.code,
                name_vietnamese: business.name_vietnamese,
                name_english: business.name_english,
                name_acronym: business.name_acronym,
                chartered_capital: business.chartered_capital,
                address: business.address,
                phone: business.phone,
                email: business.email,
                website: business.website,
                type_of_organization: business.type_of_organization,
                status: business.status,
                created_at: new Date(business.created_at),
            });

            await this.businessRepository.save(businessToUpdate);

            // Update legal representative through PersonsService
            await this.personsService.update(representative.id, {
                citizen_id: business.legal_representative.citizen_id,
                name: business.legal_representative.name,
                birth_date: new Date(business.legal_representative.birth_date),
                gender: business.legal_representative.gender,
                nationality: business.legal_representative.nationality,
                religion: business.legal_representative.religion,
                hometown: business.legal_representative.hometown,
                current_address: business.legal_representative.current_address,
            });
            // Update owner through PersonsService
            await this.personsService.update(owner.id, {
                citizen_id: business.owner.citizen_id,
                name: business.owner.name,
                birth_date: new Date(business.owner.birth_date),
                gender: business.owner.gender,
                nationality: business.owner.nationality,
                religion: business.owner.religion,
                hometown: business.owner.hometown,
                current_address: business.owner.current_address,
            });

            await this.businessRepository.save(businessToUpdate);
            return true;
        } catch (error) {
            console.error('Error updating business:', error);
            throw new Error('Failed to update business: ' + error.message);
        }
    }

    async remove(ids: string[]) {
        try {
            const deletePromises = ids.map((id) => {
                this.businessRepository.softDelete(id);
            });
            const deleteBusinessLicenses = ids.map((id) => {
                this.businessLicensesService.deleteByBusinessId(id);
            });
            await Promise.all(deletePromises);
            await Promise.all(deleteBusinessLicenses);
            return true;
        } catch (error) {
            console.error('Error removing businesses:', error);
            return 'Failed to remove businesses';
        }
    }

    async findAllMap(
        page: number,
        limit: number,
        street: string,
        type: string,
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

        if (street && street.trim() !== '') {
            query.andWhere('business.address LIKE :street', {
                street: `%${street}%`,
            });
        }

        if (type && type.trim() !== '') {
            query.andWhere('business.type_of_organization = :type', { type });
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
                    await this.employeesService.findAllByBusinessId(
                        business.id,
                    );
                const number_of_employees = employee_of_business.length;

                const license_status = await this.getLicenseStatus(business.id);
                return {
                    id: business.id,
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

    private async getLicenseStatus(business_id: string): Promise<string[]> {
        const licenses =
            await this.businessLicensesService.findOne(business_id);
        const mandatoryLicenses = await this.licenseTypeService.findMandatory();
        const missingLicenses: string[] = [];

        // If no licenses exist at all
        if (!licenses || licenses.length === 0) {
            return mandatoryLicenses.map(
                (license) => `Không có ${license.name}`,
            );
        }

        // Check for missing mandatory licenses
        for (const mandatoryLicense of mandatoryLicenses) {
            const hasLicense = licenses.some(
                (license) => license.type === mandatoryLicense.name,
            );
            if (!hasLicense) {
                missingLicenses.push(`Không có ${mandatoryLicense.name}`);
            }
        }

        return missingLicenses;
    }

    async findAllMapMarker(): Promise<MapData[]> {
        const businesses = await this.businessRepository.find({
            where: [{ longitude: Not(0) }, { latitude: Not(0) }],
        });

        const mapData: Promise<MapData>[] = businesses.map(async (business) => {
            const license_status = await this.getLicenseStatus(business.id);
            const type_of_organization =
                await this.typeOfOrganizationsService.findOne(
                    business.type_of_organization,
                );
            const object: MapData = {
                name: business.name_vietnamese,
                address: business.address,
                status: business.status,
                number_of_problem: license_status.length,
                license_status: license_status,
                lng: business.longitude,
                lat: business.latitude,
                code: business.code,
                type_of_organization: type_of_organization.name,
                id_type_of_organization: type_of_organization.id,
                id: business.id,
            };
            return object;
        });
        return Promise.all(mapData);
    }

    async updateLatLong(
        id: string,
        latitude: number,
        longitude: number,
    ): Promise<boolean | string> {
        try {
            await this.businessRepository.update(id, { latitude, longitude });
            return true;
        } catch (error) {
            console.error('Error updating latitude and longitude:', error);
            return 'Failed to update latitude and longitude';
        }
    }
}
