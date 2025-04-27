import algoliasearch from 'algoliasearch/lite';
import { envConfig } from './env';

const { VITE_ALG_ID, VITE_ALG_SEACRH_API_KEY } = envConfig;

export const searchClient = algoliasearch(VITE_ALG_ID, VITE_ALG_SEACRH_API_KEY);
export const searchIndex = searchClient.initIndex('post');
