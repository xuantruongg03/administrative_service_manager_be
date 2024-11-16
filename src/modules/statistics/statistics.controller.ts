import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { return_success } from 'src/common/return';
import REGEX from 'src/common/regex';

@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get()
    async getStatistics(
        @Query('timeRange') timeRange: 'month' | 'quarter' | 'year' | 'custom',
        @Query('value') value: string,
    ) {
        if (!timeRange || !value) {
            throw new BadRequestException('Time range and value are required');
        }

        if (timeRange === 'month') {
            if (!REGEX.MONTH_YEAR.test(value)) {
                throw new BadRequestException(
                    'Value must be in format MM/YYYY for month',
                );
            }
        } else if (timeRange === 'quarter') {
            if (!REGEX.QUARTER_YEAR.test(value)) {
                throw new BadRequestException(
                    'Value must be in format QX/YYYY for quarter',
                );
            }
        } else if (timeRange === 'year') {
            if (!REGEX.YEAR.test(value)) {
                throw new BadRequestException(
                    'Value must be in format YYYY for year',
                );
            }
        } else if (timeRange === 'custom') {
            if (!REGEX.DATE_RANGE.test(value)) {
                throw new BadRequestException(
                    'Value must be in format DD/MM/YYYY - DD/MM/YYYY for custom range',
                );
            }
        }
        const rs = await this.statisticsService.getStatistics(timeRange, value);
        if (typeof rs === 'string') {
            throw new BadRequestException(rs);
        }
        return return_success('Get statistics successfully', rs);
    }
}
