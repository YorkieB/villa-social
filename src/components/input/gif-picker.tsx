import { useState, useEffect, useRef } from 'react';
import { HeroIcon } from '@components/ui/hero-icon';

type GifResult = {
  id: string;
  title: string;
  media_formats: {
    tinygif: { url: string };
    gif: { url: string };
  };
};

type GifPickerProps = {
  onGifSelect: (url: string, previewUrl: string) => void;
  onClose: () => void;
};

const TENOR_KEY = 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ'; // Tenor v2 public demo key

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function GifPicker({ onGifSelect, onClose }: GifPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Load trending GIFs on open
  useEffect(() => {
    void fetchGifs('music');
  }, []);

  const fetchGifs = async (q: string): Promise<void> => {
    setLoading(true);
    try {
      const endpoint = q
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(q)}&key=${TENOR_KEY}&limit=20&media_filter=tinygif,gif`
        : `https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&limit=20&media_filter=tinygif,gif`;
      const res = await fetch(endpoint);
      const data = await res.json() as { results: GifResult[] };
      setGifs(data.results ?? []);
    } catch {
      setGifs([]);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 1) void fetchGifs(val);
    else if (val.length === 0) void fetchGifs('music');
  };

  return (
    <div
      ref={ref}
      className='absolute bottom-12 left-0 z-50 flex w-80 flex-col rounded-2xl border border-[#2f2f3a] bg-[#0e0e14]'
      style={{ boxShadow: '0 4px 24px rgba(245,158,11,0.15)' }}
    >
      {/* Search */}
      <div className='flex items-center gap-2 border-b border-[#2f2f3a] px-3 py-2'>
        <HeroIcon className='h-4 w-4 text-amber-500' iconName='MagnifyingGlassIcon' />
        <input
          className='flex-1 bg-transparent text-sm text-white placeholder-[#71767B] outline-none'
          placeholder='Search GIFs…'
          value={query}
          onChange={handleSearch}
          autoFocus
        />
      </div>

      {/* Grid */}
      <div className='grid max-h-72 grid-cols-2 gap-1 overflow-y-auto p-2'>
        {loading && (
          <div className='col-span-2 flex justify-center py-6'>
            <span className='text-xs text-amber-500'>Loading…</span>
          </div>
        )}
        {!loading && gifs.map((gif) => (
          <button
            key={gif.id}
            type='button'
            className='overflow-hidden rounded-lg hover:opacity-90 active:opacity-75'
            onClick={() => onGifSelect(
              gif.media_formats.gif.url,
              gif.media_formats.tinygif.url
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gif.media_formats.tinygif.url}
              alt={gif.title}
              className='h-24 w-full object-cover'
              loading='lazy'
            />
          </button>
        ))}
        {!loading && gifs.length === 0 && (
          <div className='col-span-2 py-6 text-center text-xs text-[#71767B]'>No GIFs found</div>
        )}
      </div>

      <p className='border-t border-[#2f2f3a] px-3 py-1 text-center text-[10px] text-[#71767B]'>
        Powered by Tenor
      </p>
    </div>
  );
}
