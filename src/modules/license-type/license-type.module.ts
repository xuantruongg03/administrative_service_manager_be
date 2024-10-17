import { Module } from '@nestjs/common';
import { LicenseTypeService } from './license-type.service';
import { LicenseTypeController } from './license-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseType } from './entities/license-type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LicenseType])],
    controllers: [LicenseTypeController],
    providers: [LicenseTypeService],
    exports: [LicenseTypeService],
})
export class LicenseTypeModule {}
