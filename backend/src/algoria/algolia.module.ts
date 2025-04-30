import { Module } from '@nestjs/common';
import { AlgoliaController } from './algolia.controller';
import { AlgoliaService } from './algolia.service';

@Module({
  controllers: [AlgoliaController],
  providers: [AlgoliaService],
})
export class AlgoliaModule {}
