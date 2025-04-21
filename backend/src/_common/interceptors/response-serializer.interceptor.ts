import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Observable, map } from 'rxjs';

export const SERIALIZER_META_KEY = 'serializer-dto';

@Injectable()
export class ResponseSerializerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dto = this.reflector.get<Type<any>>(
      SERIALIZER_META_KEY,
      context.getHandler(),
    );

    if (!dto) return next.handle();

    return next.handle().pipe(
      map((data) => {
        const transformed = plainToInstance(dto, data, {
          excludeExtraneousValues: true,
        });

        const errors = validateSync(transformed as any, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
          throw new InternalServerErrorException({
            message: 'Invalid response data',
            errors,
          });
        }

        return transformed;
      }),
    );
  }
}
