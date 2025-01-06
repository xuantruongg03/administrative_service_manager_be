import {
    BadRequestException,
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
import { return_success } from 'src/common/return';
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
            throw new BadRequestException(rs);
        }
        return return_success('Business created successfully');
    }

    @Post('create-business-by-excel')
    @UseInterceptors(FileInterceptor('file'))
    async createBusinessByExcel(@UploadedFile() file: Express.Multer.File) {
        const rs = await this.businessesService.createBusinessByExcel(file);
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
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
            throw new BadRequestException('Page are required');
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

    @Patch(':id')
    async update(@Param('id') id: string, @Body() business: BusinessInforDTO) {
        if (!id) {
            throw new BadRequestException('Business id is required');
        }
        const rs = await this.businessesService.update(id, business);
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Business updated successfully');
    }

    @Delete()
    async remove(@Body() ids: string[]) {
        if (!ids || ids.length === 0) {
            throw new BadRequestException('ids are required');
        }
        const rs = await this.businessesService.remove(ids);
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses deleted successfully');
    }

    @Delete('remove-all')
    async removeAll() {
        const rs = await this.businessesService.removeAll();
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Businesses deleted successfully');
    }

    @Get('map')
    async findAllMap(
        @Query()
        query: {
            page: number;
            limit: number;
            street: string;
            type: string;
        },
    ) {
        const { page, limit, street, type } = query;
        const pageNumber = Number(page);
        let limitNumber = Number(limit);
        if (!page) {
            throw new BadRequestException('Page is required');
        }
        if (!limitNumber) {
            limitNumber = CONSTANTS.LIMIT_BUSINESS_PER_PAGE;
        }
        const rs = await this.businessesService.findAllMap(
            pageNumber,
            limitNumber,
            street,
            type,
        );
        return return_success('Businesses fetched successfully', rs);
    }

    @Get('map-marker')
    async findAllMapMarker() {
        const rs = await this.businessesService.findAllMapMarker();
        return return_success('Businesses fetched successfully', rs);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        if (!id) {
            throw new BadRequestException('id are required');
        }
        const rs = await this.businessesService.findOne(id);
        return return_success('Business fetched successfully', rs);
    }

    @Patch('/:id/update-lat-lon')
    async updateLatLong(
        @Param('id') id: string,
        @Body() body: { latitude: number; longitude: number },
    ) {
        if (!id) {
            throw new BadRequestException('id are required');
        }
        const { latitude, longitude } = body;
        if (!latitude || !longitude) {
            throw new BadRequestException(
                'latitude and longitude are required',
            );
        }
        if (isNaN(latitude) || isNaN(longitude)) {
            throw new BadRequestException('latitude and longitude are invalid');
        }
        const rs = await this.businessesService.updateLatLong(
            id,
            latitude,
            longitude,
        );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Business updated successfully');
    }
}
