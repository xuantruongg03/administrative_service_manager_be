import {
    BadRequestException,
    Controller,
    Get,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { return_error_400 } from 'src/common/return';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}
    @Get()
    findAll(@Query() query: { businessCode: string }) {
        if (!query.businessCode) {
            return return_error_400('Business code is required');
        }
        return this.employeesService.findAllByBusinessCode(query.businessCode);
    }

    @Post('create-by-excel')
    @UseInterceptors(FileInterceptor('file'))
    async createEmployeeByExcel(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: { businessCode: string },
    ) {
        if (!query.businessCode) {
            return new BadRequestException('Business code is required');
        }
        const rs = await this.employeesService.createPersonByExcel(
            file,
            query.businessCode,
        );
        if (typeof rs === 'string') {
            return new BadRequestException(rs);
        }
        return {
            code: 200,
            message: 'Create employees successfully',
        };
    }
}
