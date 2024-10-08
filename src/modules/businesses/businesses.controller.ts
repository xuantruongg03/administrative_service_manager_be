import {
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { return_success } from 'src/common/return';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('businesses')
export class BusinessesController {
    constructor(private readonly businessesService: BusinessesService) {}

    @Post()
    create(@Body() createBusinessDto: CreateBusinessDto) {
        return this.businessesService.create(createBusinessDto);
    }

    @Post('create-business-by-excel')
    @UseInterceptors(FileInterceptor('file'))
    async createBusinessByExcel(@UploadedFile() file: Express.Multer.File) {
        const rs = await this.businessesService.createBusinessByExcel(file);
        if (typeof rs === 'string') {
            throw new InternalServerErrorException(rs);
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
