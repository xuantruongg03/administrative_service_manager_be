import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
    private readonly baseUrl = process.env.URL_GEOCODING;
    private readonly apiKey = process.env.GEOCODING_API_KEY;

    async getCoordinates(
        address: string,
    ): Promise<{ latitude: number; longitude: number }> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    q: address,
                    api_key: this.apiKey,
                },
            });

            if (response.data && response.data.length > 0) {
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
    }
}
