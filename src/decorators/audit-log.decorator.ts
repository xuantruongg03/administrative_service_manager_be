import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

export const AUDIT_KEY = 'audit_key';
export const Audit = (action: string) => SetMetadata(AUDIT_KEY, action);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = new Date();
        const request = context.switchToHttp().getRequest();
        const action = this.reflector.get<string>(
            AUDIT_KEY,
            context.getHandler(),
        );

        const method = request.method;
        const args = request.body;
        const user = request.user?.id; // If you have user context

        return next.handle().pipe(
            tap({
                next: () => {
                    const auditLog = {
                        timestamp: startTime,
                        action,
                        method,
                        user,
                        args,
                        duration: new Date().getTime() - startTime.getTime(),
                    };
                    this.saveAuditLog(auditLog);
                },
                error: (error) => {
                    const auditLog = {
                        timestamp: startTime,
                        action,
                        method,
                        user,
                        args,
                        error: {
                            message: error.message,
                            stack: error.stack,
                        },
                        duration: new Date().getTime() - startTime.getTime(),
                    };
                    this.saveAuditLog(auditLog);
                },
            }),
        );
    }

    private async saveAuditLog(auditLog: any) {
        console.log('[Audit Log]', JSON.stringify(auditLog, null, 2));
    }
}
