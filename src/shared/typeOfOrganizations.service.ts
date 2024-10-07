import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOfOrganization } from 'src/modules/type-of-organizations/entities/type-of-organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOfOrganizationsService implements OnModuleInit {
    constructor(
        @InjectRepository(TypeOfOrganization)
        private readonly typeOfOrganizationRepository: Repository<TypeOfOrganization>,
    ) {}

    async onModuleInit() {
        const typeOfOrganizations =
            await this.typeOfOrganizationRepository.find();
        if (typeOfOrganizations.length === 0) {
            await this.seedData();
        }
    }

    private async seedData() {
        const typeOfOrganizations = [
            { id: '783901245612', name: 'Sản xuất con dấu' },
            { id: '456789012345', name: 'Kinh doanh công cụ hỗ trợ' },
            { id: '234567890123', name: 'Kinh doanh các loại pháo' },
            { id: '890123456789', name: 'Kinh doanh dịch vụ cầm đồ' },
            { id: '345678901234', name: 'Kinh doanh dịch vụ xoa bóp' },
            {
                id: '901234567890',
                name: 'Kinh doanh thiết bị phát tín hiệu của xe được quyền ưu tiên',
            },
            { id: '567890123456', name: 'Kinh doanh dịch vụ bảo vệ' },
            { id: '123456789012', name: 'Kinh doanh súng bắn sơn' },
            {
                id: '678901234567',
                name: 'Kinh doanh trò chơi điện tử có thưởng dành cho người nước ngoài',
            },
            { id: '234567890124', name: 'Kinh doanh casino' },
            { id: '789012345678', name: 'Kinh doanh dịch vụ đặt cược' },
            { id: '345678901235', name: 'Kinh doanh khí' },
            { id: '901234567891', name: 'Kinh doanh vật liệu nổ công nghiệp' },
            { id: '456789012346', name: 'Kinh doanh tiền chất thuốc nổ' },
            {
                id: '012345678901',
                name: 'Kinh doanh ngành, nghề có sử dụng vật liệu nổ công nghiệp và tiền chất thuốc nổ',
            },
            { id: '567890123457', name: 'Kinh doanh dịch vụ nổ mìn' },
            { id: '123456789013', name: 'Kinh doanh dịch vụ in' },
            {
                id: '678901234568',
                name: 'Kinh doanh các thiết bị gây nhiễu, phá sóng thông tin di động',
            },
            {
                id: '234567890125',
                name: 'Kinh doanh dịch vụ phẫu thuật thẩm mỹ',
            },
            {
                id: '789012345679',
                name: 'Kinh doanh dịch vụ karaoke, vũ trường',
            },
            { id: '345678901236', name: 'Kinh doanh dịch vụ lưu trú' },
            {
                id: '901234567892',
                name: 'Kinh doanh quân trang, quân dụng cho lực lượng vũ trang, vũ khí quân dụng, trang thiết bị kỹ thuật, khí tài, phương tiện chuyên dùng cho quân sự, công an',
            },
        ];
        await this.typeOfOrganizationRepository.save(typeOfOrganizations);
        console.log('TypeOfOrganizations seeded');
    }
}
