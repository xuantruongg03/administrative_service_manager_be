import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BussinessLicensesService } from './bussiness-licenses.service';
import { CreateBussinessLicenseDto } from './dto/create-bussiness-license.dto';
import { UpdateBussinessLicenseDto } from './dto/update-bussiness-license.dto';

@Controller('bussiness-licenses')
export class BussinessLicensesController {
  constructor(private readonly bussinessLicensesService: BussinessLicensesService) {}

  @Post()
  create(@Body() createBussinessLicenseDto: CreateBussinessLicenseDto) {
    return this.bussinessLicensesService.create(createBussinessLicenseDto);
  }

  @Get()
  findAll() {
    return this.bussinessLicensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bussinessLicensesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBussinessLicenseDto: UpdateBussinessLicenseDto) {
    return this.bussinessLicensesService.update(+id, updateBussinessLicenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bussinessLicensesService.remove(+id);
  }
}
