import { Public } from '@common/decorators/is-public.decorator';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AlgoliaService } from './algolia.service';

@Controller('algolia')
export class AlgoliaController {
  constructor(private readonly algoliaService: AlgoliaService) {}

  @Public()
  @HttpCode(200)
  @Post('/search/posts')
  public async searchPosts(
    @Body() body: { query: string },
  ): Promise<{ hits: { objectID: string }[] }> {
    return this.algoliaService.searchPosts(body.query);
  }
}
