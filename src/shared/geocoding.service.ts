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
                        address: address,
                        api_key: this.apiKey,
                    },
                });
                if (response.data?.results?.length > 0) {
                    const result = response.data.results[0].geometry.location;
                    return {
                        latitude: result.lat,
                        longitude: result.lng,
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
