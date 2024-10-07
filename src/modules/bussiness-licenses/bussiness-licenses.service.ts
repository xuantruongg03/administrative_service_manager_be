import { Injectable } from '@nestjs/common';
import { CreateBussinessLicenseDto } from './dto/create-bussiness-license.dto';
import { UpdateBussinessLicenseDto } from './dto/update-bussiness-license.dto';

@Injectable()
export class BussinessLicensesService {
  create(createBussinessLicenseDto: CreateBussinessLicenseDto) {
    return 'This action adds a new bussinessLicense';
  }

  findAll() {
    return `This action returns all bussinessLicenses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bussinessLicense`;
  }

  update(id: number, updateBussinessLicenseDto: UpdateBussinessLicenseDto) {
    return `This action updates a #${id} bussinessLicense`;
  }

  remove(id: number) {
    return `This action removes a #${id} bussinessLicense`;
  }
}
