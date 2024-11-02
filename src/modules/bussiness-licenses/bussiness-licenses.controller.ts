import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
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

    @Post('/business-license/:businessId/upload')
    @UseInterceptors(FileInterceptor('file'))
    async createBusinessLicense(
        @UploadedFile() file: Express.Multer.File,
        @Param('businessId') businessId: string,
    ) {
        const rs = await this.businessLicensesService.createBusinessLicense(
            file,
            businessId,
        );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses created successfully');
    }

    @Post('/security-license/:businessId/upload')
    @UseInterceptors(FileInterceptor('file'))
    async createSecurityLicense(
        @UploadedFile() file: Express.Multer.File,
        @Param('businessId') businessId: string,
    ) {
        const rs = await this.businessLicensesService.createSecurityLicense(
            file,
            businessId,
        );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses created successfully');
    }

    @Post('/fire-prevention-license/:businessId/upload')
    @UseInterceptors(FileInterceptor('file'))
    async createFirePreventionLicense(
        @UploadedFile() file: Express.Multer.File,
        @Param('businessId') businessId: string,
    ) {
        const rs =
            await this.businessLicensesService.createFirePreventionLicense(
                file,
                businessId,
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

    @Get('')
    async getAllBusinessLicense(
        @Query() query: { page: number; limit: number },
    ) {
        const { page, limit } = query;
        if (!page || !limit) {
            throw new BadRequestException('Page and limit are required');
        }
        const rs = await this.businessLicensesService.getAllBusinessLicense(
            page,
            limit,
        );
        return return_success('Get all business licenses successfully', rs);
    }
}
