import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'


export interface Response<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((data) => {
                if (data && typeof data === 'object' && 'success' in data) {
                    return data;
                }

                if (response.statusCode === 204) {
                    response.statusCode = 200;
                    return {
                        success: true,
                        data: null,
                        message: this.getDefaultMessage(request.method, 204),
                        timestamp: new Date().toISOString(),
                    }
                }

                if (data === null || data === undefined) {
                    return {
                        success: true,
                        data: null,
                        message: this.getDefaultMessage(request.method, response.statusCode),
                        timestamp: new Date().toISOString(),
                    }
                }

                return {
                    success: true,
                    // مهم‌ترین بخش: دیتا را همان‌طور که هست برمی‌گردانیم (شامل توکن‌ها و غیره)
                    data: data !== undefined ? data : null, 
                    message: this.getDefaultMessage(request.method, response.statusCode),
                    timestamp: new Date().toISOString(),
                };
            })
        )
    }
    private getDefaultMessage(method: string, statusCode: number): string {
        const messages: Record<string, Record<number, string>> = {
            GET: {
                200: 'اطلاعات با موفقیت دریافت شد'
            },
            POST: {
                201: 'رکورد با موفقیت ساخته شد',
            },
            PATCH: {
                200: 'رکورد با موفقیت  به روز رسانی شد '
            },
            PUT: {
                200: 'رکورد با موفقیت  به روز رسانی شد '
            },
            DELETE: {
                200: 'رکورد با موفقیت حذف شد ',
                204: 'رکورد با موفقیت حذف شد '
            }

        };
        return messages[method]?.[statusCode] || 'عملیات با موفقیت انجام شد'
    }
}