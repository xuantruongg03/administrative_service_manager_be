import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOfOrganizationDTO } from './dto/type-of-organization.dto';
import { TypeOfOrganization } from './entities/type-of-organization.entity';

@Injectable()
export class TypeOfOrganizationsService {
    constructor(
        @InjectRepository(TypeOfOrganization)
        private readonly typeOfOrganizationRepository: Repository<TypeOfOrganization>,
    ) {}

    private toDto(organization: TypeOfOrganization): TypeOfOrganizationDTO {
        return {
            id: organization.id,
            name: organization.name,
        };
    }

    async findAll(): Promise<TypeOfOrganizationDTO[]> {
        const organizations = await this.typeOfOrganizationRepository.find();
        return organizations.map((org) => this.toDto(org));
    }

    async findByName(name: string): Promise<TypeOfOrganizationDTO> {
        const organization = await this.typeOfOrganizationRepository.findOne({
            where: { name },
        });
        return this.toDto(organization);
    }
}
