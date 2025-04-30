import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { algoliasearch, SearchClient } from 'algoliasearch';

@Injectable()
export class AlgoliaService {
  private client: SearchClient;
  private indexName: string;

  constructor(private configService: ConfigService) {
    const ALG_ID = this.configService.get<string>('ALG_ID');
    const ALG_API_KEY = this.configService.get<string>('ALG_API_KEY');
    const ALG_INDEX_NAME = this.configService.get<string>('ALG_INDEX_NAME');

    if (!ALG_ID || !ALG_API_KEY || !ALG_INDEX_NAME) {
      throw new Error('Missing Algolia environment variables');
    }

    this.indexName = ALG_INDEX_NAME;
    this.client = algoliasearch(ALG_ID, ALG_API_KEY);
  }

  public async searchPosts(
    query: string,
  ): Promise<{ hits: { objectID: string }[] }> {
    const res = await this.client.searchSingleIndex({
      indexName: this.indexName,
      searchParams: { query },
    });

    return { hits: res.hits };
  }
}
