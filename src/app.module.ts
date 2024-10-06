import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GeocodingService } from './services/geocoding.service';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
        }),
    ],
    controllers: [AppController],
    providers: [AppService, GeocodingService],
})
export class AppModule {}
