import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { return_error_400, return_success } from 'src/common/return';
import { CreateEmployeeDTO } from './dto/employee.dto';
import { EmployeesService } from './employees.service';
import CONSTANTS from 'src/common/constants';

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

    @Get('/employee-info/:businessCode')
    async getEmployeeInfo(
        @Param('businessCode') businessCode: string,
        @Query() query: { page: number; limit: number },
    ) {
        const { page, limit } = query;
        const pageNumber = Number(page);
        let limitNumber = Number(limit);
        if (!page) {
            return return_error_400('Page are required');
        }
        if (!limitNumber) {
            limitNumber = CONSTANTS.LIMIT_BUSINESS_PER_PAGE;
        }
        const rs = await this.employeesService.getEmployeeInfoWithPagination(
            businessCode,
            pageNumber,
            limitNumber,
        );
        return return_success('Get employee info successfully', rs);
    }

    @Post('/create/:businessCode')
    async createEmployeeInfo(
        @Param('businessCode') businessCode: string,
        @Body() body: CreateEmployeeDTO,
    ) {
        const rs = await this.employeesService.createEmployee(
            businessCode,
            body,
        );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Create employee info successfully');
    }

    @Delete('/:citizen_id')
    async deleteEmployeeInfo(@Param('citizen_id') citizen_id: string) {
        const rs = await this.employeesService.deleteEmployee(citizen_id);
        if (!rs) {
            throw new BadRequestException('Delete employee info failed');
        }
        return return_success('Delete employee info successfully');
    }

    @Put('/:businessCode/:citizen_id')
    async updateEmployeeInfo(
        @Param('businessCode') businessCode: string,
        @Param('citizen_id') citizen_id: string,
        @Body() body: CreateEmployeeDTO,
    ) {
        const rs = await this.employeesService.updateEmployee(
            businessCode,
            citizen_id,
            body,
        );
        if (!rs) {
            throw new BadRequestException('Update employee info failed');
        }
        return return_success('Update employee info successfully');
    }
}
