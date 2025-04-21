import { SERIALIZER_META_KEY } from '@common/interceptors/response-serializer.interceptor';
import { SetMetadata } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces';

export const Serialize = <T>(dto: Type<T>) =>
  SetMetadata(SERIALIZER_META_KEY, dto);
