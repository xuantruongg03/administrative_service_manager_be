import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class BusinessCacheInterceptor implements NestInterceptor {
    private readonly cache = new Map<
        string,
        { data: any; timestamp: number }
    >();
    private readonly TTL = 5 * 60 * 1000; // 5 minutes cache

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, query } = request;

        // Only cache GET requests
        if (method !== 'GET') {
            return next.handle();
        }

        const cacheKey = this.generateCacheKey(url, query);
        const cachedData = this.cache.get(cacheKey);
        const now = Date.now();

        if (cachedData && now - cachedData.timestamp < this.TTL) {
            console.log(`[Cache] Hit for ${cacheKey}`);
            return of(cachedData.data);
        }

        return next.handle().pipe(
            tap((data) => {
                console.log(`[Cache] Miss for ${cacheKey}`);
                this.cache.set(cacheKey, {
                    data,
                    timestamp: now,
                });
            }),
        );
    }

    private generateCacheKey(url: string, query: any): string {
        return `${url}?${JSON.stringify(query)}`;
    }

    public clearCache(pattern?: string) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }
}
