import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { return_error_400 } from 'src/common/return';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}
    //Get all employees owned by a business
    @Get()
    findAll(@Query() query: { businessCode: string }) {
        if (!query.businessCode) {
            return return_error_400('Business code is required');
        }
        return this.employeesService.findAllByBusinessCode(query.businessCode);
    }

    @Post('create-employee-by-excel')
    @UseInterceptors(FileInterceptor)
    createEmployeeByExcel(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: { businessCode: string },
    ) {
        //Check type file if not .csv,.xls,.xlsx then throw error with status code 400
        if (!file.mimetype.match(/\/(csv|xls|xlsx)$/)) {
            throw new BadRequestException('Unsupported file type');
        }
        const rs = this.employeesService.createPersonByExcel(file, query);
        if (!rs) {
            throw new InternalServerErrorException('Upload file failed');
        }
        return {
            code: 200,
            message: 'Create employees successfully',
        };
    }
}
