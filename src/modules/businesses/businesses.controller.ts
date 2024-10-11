import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import CONSTANTS from 'src/common/constants';
import { return_error_400, return_success } from 'src/common/return';
import { BusinessesService } from './businesses.service';
import { Business } from './entities/businesses.entity';

@Controller('businesses')
export class BusinessesController {
    constructor(private readonly businessesService: BusinessesService) {}

    @Post()
    async create(@Body() business: Business) {
        const rs = await this.businessesService.create(business);
        if (typeof rs === 'string') {
            return return_error_400(rs);
        }
        return return_success('Business created successfully');
    }

    @Post('create-business-by-excel')
    @UseInterceptors(FileInterceptor('file'))
    async createBusinessByExcel(@UploadedFile() file: Express.Multer.File) {
        const rs = await this.businessesService.createBusinessByExcel(file);
        if (typeof rs === 'string') {
            return return_error_400(rs);
        }
        return return_success('Businesses created successfully');
    }

    @Get('export-excel')
    async exportExcel(@Res() res: Response) {
        const { buffer, fileName } =
            await this.businessesService.exportBusinessToExcel();
        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
            'Content-Length': buffer.length,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
        });
        res.end(buffer);
    }

    @Get()
    async findAll(
        @Query() query: { page: number; limit: number; keyword: string },
    ) {
        const { page, limit, keyword } = query;
        const pageNumber = Number(page);
        let limitNumber = Number(limit);
        if (!page) {
            return return_error_400('Page are required');
        }
        if (!limitNumber) {
            limitNumber = CONSTANTS.LIMIT_BUSINESS_PER_PAGE;
        }
        const rs = await this.businessesService.findAll(
            pageNumber,
            limitNumber,
            keyword,
        );
        return return_success('Businesses fetched successfully', rs);
    }

    @Get(':code')
    findOne(@Param('code') code: string) {
        if (!code) {
            return return_error_400('Code are required');
        }
        return this.businessesService.findOne(code);
    }

    @Patch(':code')
    update(@Param('code') code: string, @Body() business: Business) {
        if (!code) {
            return return_error_400('Code are required');
        }
        return this.businessesService.update(code, business);
    }

    @Delete()
    remove(@Body() code: string[]) {
        if (!code || code.length === 0) {
            return return_error_400('Code are required');
        }
        return this.businessesService.remove(code);
    }
}
