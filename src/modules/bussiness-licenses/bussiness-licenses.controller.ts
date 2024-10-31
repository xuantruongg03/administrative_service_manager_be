import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BussinessLicensesService } from './bussiness-licenses.service';
import { return_error_400, return_success } from 'src/common/return';
import { CreateBusinessLicenseDto } from './dto/create-business-license.dto';

@Controller('bussiness-licenses')
export class BussinessLicensesController {
    constructor(
        private readonly businessLicensesService: BussinessLicensesService,
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createBusinessByExcel(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateBusinessLicenseDto,
    ) {
        const rs = await this.businessLicensesService.create(file, body);
        if (typeof rs === 'string') {
            return return_error_400(rs);
        }
        return return_success('Businesses created successfully');
    }
}
