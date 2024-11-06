import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { return_success } from 'src/common/return';

@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get()
    async getStatistics(
        @Query('timeRange') timeRange: 'month' | 'quarter' | 'year',
        @Query('value') value: string,
    ) {
        const rs = await this.statisticsService.getStatistics(timeRange, value);
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Get statistics successfully', rs);
    }
}
