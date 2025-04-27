import algoliasearch from 'algoliasearch/lite';

const { VITE_ALG_ID, VITE_ALG_SEACRH_API_KEY } = import.meta.env;

export const searchClient = algoliasearch(VITE_ALG_ID, VITE_ALG_SEACRH_API_KEY);
export const searchIndex = searchClient.initIndex('post');
