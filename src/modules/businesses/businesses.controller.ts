import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { return_error_400, return_success } from 'src/common/return';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
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

    @Get()
    findAll() {
        return this.businessesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.businessesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateBusinessDto: UpdateBusinessDto,
    ) {
        return this.businessesService.update(+id, updateBusinessDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.businessesService.remove(+id);
    }
}
