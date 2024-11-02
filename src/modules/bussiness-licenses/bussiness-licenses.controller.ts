import {
    BadRequestException,
    Controller,
    Delete,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { return_success } from 'src/common/return';
import { BussinessLicensesService } from './bussiness-licenses.service';

@Controller('bussiness-licenses')
export class BussinessLicensesController {
    constructor(
        private readonly businessLicensesService: BussinessLicensesService,
    ) {}

    @Post('/business-license/:businessCode/upload')
    @UseInterceptors(FileInterceptor('file'))
    async createBusinessLicense(
        @UploadedFile() file: Express.Multer.File,
        @Param('businessCode') businessCode: string,
    ) {
        const rs = await this.businessLicensesService.createBusinessLicense(
            file,
            businessCode,
        );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses created successfully');
    }

    @Post('/security-license/:businessCode/upload')
    @UseInterceptors(FileInterceptor('file'))
    async createSecurityLicense(
        @UploadedFile() file: Express.Multer.File,
        @Param('businessCode') businessCode: string,
    ) {
        const rs = await this.businessLicensesService.createSecurityLicense(
            file,
            businessCode,
        );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses created successfully');
    }

    @Post('/fire-prevention-license/:businessCode/upload')
    @UseInterceptors(FileInterceptor('file'))
    async createFirePreventionLicense(
        @UploadedFile() file: Express.Multer.File,
        @Param('businessCode') businessCode: string,
    ) {
        const rs =
            await this.businessLicensesService.createFirePreventionLicense(
                file,
                businessCode,
            );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses created successfully');
    }

    @Delete('/:id')
    async deleteBusinessLicense(@Param('id') id: string) {
        const rs = await this.businessLicensesService.delete(id);
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses deleted successfully');
    }
}
