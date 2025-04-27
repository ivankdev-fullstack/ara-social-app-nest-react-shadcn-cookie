import { searchIndex } from '@/_common/config/algoria';
import { useState } from 'react';
import { Input } from '../ui/input';
import { SearchItem } from './SearchItem';

export const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<any[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.trim() === '') {
      setHits([]);
      setQuery('');
      return;
    }
    setQuery(value);

    const result = await searchIndex.search(value);
    setHits(result.hits);
  };

  return (
    <div className="relative w-[300px]">
      <Input
        value={query}
        onChange={handleChange}
        placeholder="Search posts..."
        className="w-full rounded-full border-none bg-blue-400 text-white shadow-none placeholder:text-white"
      />
      {!!query.length && (
        <div className="absolute top-full right-0 left-0 z-1000 mt-2 rounded-lg bg-white shadow-lg">
          {!!hits.length && hits.map((hit) => <SearchItem hit={hit} />)}
          {!hits.length && (
            <span className="block py-3 text-center text-sm text-gray-600">
              No results.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
