import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

interface BlockedIP {
    startTime: number;
    endTime: number;
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
    // Lưu trữ request history cho mỗi IP
    private readonly requestMap = new Map<string, number[]>();

    // Lưu trữ các IP bị block
    private readonly blockedIPs = new Map<string, BlockedIP>();

    // Constants
    private readonly WINDOW_SIZE = 60000; // 1 phút
    private readonly MAX_REQUESTS = 1000; // Tối đa 100 requests/phút
    private readonly BLOCK_DURATION = 180000; // Thời gian block: 3 phút

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip;
        const now = Date.now();

        // Kiểm tra xem IP có đang bị block không
        if (this.isBlocked(ip)) {
            const blockInfo = this.blockedIPs.get(ip);
            const remainingTime = Math.ceil((blockInfo.endTime - now) / 1000);

            throw new HttpException(
                {
                    status: HttpStatus.TOO_MANY_REQUESTS,
                    error: 'IP has been temporarily blocked due to too many requests',
                    remainingTime: `${remainingTime} seconds`,
                    nextValidRequestTime: new Date(
                        blockInfo.endTime,
                    ).toISOString(),
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // Lấy lịch sử request của IP
        const requests = this.requestMap.get(ip) || [];

        // Chỉ giữ lại các requests trong window hiện tại
        const recentRequests = requests.filter(
            (timestamp) => now - timestamp < this.WINDOW_SIZE,
        );

        // Kiểm tra số lượng request
        if (recentRequests.length >= this.MAX_REQUESTS) {
            // Block IP
            this.blockIP(ip);

            throw new HttpException(
                {
                    status: HttpStatus.TOO_MANY_REQUESTS,
                    error: 'Too many requests. Your IP has been blocked for 3 minutes.',
                    nextValidRequestTime: new Date(
                        now + this.BLOCK_DURATION,
                    ).toISOString(),
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // Thêm request hiện tại vào history
        recentRequests.push(now);
        this.requestMap.set(ip, recentRequests);

        // Log cho development
        console.log(
            `[Rate Limit] IP: ${ip}, Requests in last minute: ${recentRequests.length}`,
        );

        return next.handle();
    }

    private isBlocked(ip: string): boolean {
        const blockInfo = this.blockedIPs.get(ip);
        if (!blockInfo) return false;

        const now = Date.now();
        if (now > blockInfo.endTime) {
            // Hết thời gian block, xóa khỏi danh sách
            this.blockedIPs.delete(ip);
            this.requestMap.delete(ip); // Reset request history
            return false;
        }

        return true;
    }

    private blockIP(ip: string) {
        const now = Date.now();
        this.blockedIPs.set(ip, {
            startTime: now,
            endTime: now + this.BLOCK_DURATION,
        });

        // Log block event
        console.log(
            `[Rate Limit] IP ${ip} blocked until ${new Date(now + this.BLOCK_DURATION).toISOString()}`,
        );
    }

    // Method để kiểm tra trạng thái của một IP (có thể dùng cho monitoring)
    public getIPStatus(ip: string) {
        const requests = this.requestMap.get(ip) || [];
        const blockInfo = this.blockedIPs.get(ip);
        const now = Date.now();

        return {
            ip,
            recentRequests: requests.filter(
                (timestamp) => now - timestamp < this.WINDOW_SIZE,
            ).length,
            isBlocked: this.isBlocked(ip),
            blockInfo: blockInfo
                ? {
                      startTime: new Date(blockInfo.startTime).toISOString(),
                      endTime: new Date(blockInfo.endTime).toISOString(),
                      remainingTime: Math.max(
                          0,
                          Math.ceil((blockInfo.endTime - now) / 1000),
                      ),
                  }
                : null,
        };
    }
}
