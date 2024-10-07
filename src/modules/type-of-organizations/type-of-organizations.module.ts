import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfOrganizationsService } from './type-of-organizations.service';
import { TypeOfOrganizationsController } from './type-of-organizations.controller';
import { TypeOfOrganization } from './entities/type-of-organization.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TypeOfOrganization])],
    controllers: [TypeOfOrganizationsController],
    providers: [TypeOfOrganizationsService],
    exports: [TypeOfOrganizationsService],
})
export class TypeOfOrganizationsModule {}
