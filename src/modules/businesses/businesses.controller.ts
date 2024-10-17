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
import { BusinessInforDTO } from './dto/business.dto';
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

    @Patch(':code')
    update(@Param('code') code: string, @Body() business: BusinessInforDTO) {
        if (!code) {
            return return_error_400('Code are required');
        }
        return this.businessesService.update(code, business);
    }

    @Delete()
    async remove(@Body() ids: string[]) {
        if (!ids || ids.length === 0) {
            return return_error_400('ids are required');
        }
        const rs = await this.businessesService.remove(ids);
        if (typeof rs === 'string') {
            return return_error_400(rs);
        }
        return return_success('Businesses deleted successfully');
    }

    @Get('map')
    async findAllMap(@Query() query: { page: number; limit: number }) {
        const { page, limit } = query;
        const pageNumber = Number(page);
        let limitNumber = Number(limit);
        if (!page) {
            return return_error_400('Page is required');
        }
        if (!limitNumber) {
            limitNumber = CONSTANTS.LIMIT_BUSINESS_PER_PAGE;
        }
        const rs = await this.businessesService.findAllMap(
            pageNumber,
            limitNumber,
        );
        return return_success('Businesses fetched successfully', rs);
    }

    @Get('map-marker')
    async findAllMapMarker() {
        const rs = await this.businessesService.findAllMapMarker();
        return return_success('Businesses fetched successfully', rs);
    }

    @Get(':code')
    async findOne(@Param('code') code: string) {
        if (!code) {
            return return_error_400('Code are required');
        }
        const rs = await this.businessesService.findOne(code);
        return return_success('Business fetched successfully', rs);
    }
}
