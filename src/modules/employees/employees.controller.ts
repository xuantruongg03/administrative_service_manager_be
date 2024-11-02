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
import { return_success } from 'src/common/return';
import { CreateEmployeeDTO } from './dto/employee.dto';
import { EmployeesService } from './employees.service';
import CONSTANTS from 'src/common/constants';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}
    @Get()
    findAll(@Query() query: { businessId: string }) {
        if (!query.businessId) {
            throw new BadRequestException('Business id is required');
        }
        return this.employeesService.findAllByBusinessId(query.businessId);
    }

    @Post('create-by-excel')
    @UseInterceptors(FileInterceptor('file'))
    async createEmployeeByExcel(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: { businessId: string },
    ) {
        if (!query.businessId) {
            throw new BadRequestException('Business id is required');
        }
        const rs = await this.employeesService.createPersonByExcel(
            file,
            query.businessId,
        );
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Create employees successfully');
    }

    @Get('/employee-info/:businessId')
    async getEmployeeInfo(
        @Param('businessId') businessId: string,
        @Query() query: { page: number; limit: number },
    ) {
        const { page, limit } = query;
        const pageNumber = Number(page);
        let limitNumber = Number(limit);
        if (!page) {
            throw new BadRequestException('Page are required');
        }
        if (!limitNumber) {
            limitNumber = CONSTANTS.LIMIT_BUSINESS_PER_PAGE;
        }
        const rs = await this.employeesService.getEmployeeInfoWithPagination(
            businessId,
            pageNumber,
            limitNumber,
        );
        return return_success('Get employee info successfully', rs);
    }

    @Post('/create/:businessId')
    async createEmployeeInfo(
        @Param('businessId') businessId: string,
        @Body() body: CreateEmployeeDTO,
    ) {
        const rs = await this.employeesService.createEmployee(businessId, body);
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

    @Put('/:businessId/:citizen_id')
    async updateEmployeeInfo(
        @Param('businessId') businessId: string,
        @Param('citizen_id') citizen_id: string,
        @Body() body: CreateEmployeeDTO,
    ) {
        const rs = await this.employeesService.updateEmployee(
            businessId,
            citizen_id,
            body,
        );
        if (!rs) {
            throw new BadRequestException('Update employee info failed');
        }
        return return_success('Update employee info successfully');
    }
}
