import Bottleneck from 'bottleneck';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
    private readonly baseUrl = process.env.URL_GEOCODING;
    private readonly apiKey = process.env.GEOCODING_API_KEY;

    // Tạo một Bottleneck limiter để giới hạn số lượng request
    private readonly limiter = new Bottleneck({
        minTime: 1000, // Tối thiểu 1 giây giữa các request
        maxConcurrent: 1, // Chỉ cho phép 1 request gửi đi cùng lúc
    });

    async getCoordinates(
        address: string,
    ): Promise<{ latitude: number; longitude: number }> {
        return this.limiter.schedule(async () => {
            try {
                const response = await axios.get(this.baseUrl, {
                    params: {
                        q: address,
                        key: this.apiKey,
                        format: 'json',
                    },
                });
                if (response.data.length > 0) {
                    const result = response.data[0];
                    return {
                        latitude: parseFloat(result.lat),
                        longitude: parseFloat(result.lon),
                    };
                } else {
                    console.log('Address not found:', address);
                    return {
                        latitude: 0,
                        longitude: 0,
                    };
                }
            } catch (error) {
                console.log(address);
                console.error('Geocoding service error:', error);
                return {
                    latitude: 0,
                    longitude: 0,
                };
            }
        });
    }
}
