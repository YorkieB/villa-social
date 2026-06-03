import { useState } from 'react';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';

export type PollData = {
  options: string[];
  duration: number; // hours
};

type PollInputProps = {
  onPollChange: (poll: PollData | null) => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function PollInput({ onPollChange }: PollInputProps) {
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(24);

  const update = (newOptions: string[], newDuration: number): void => {
    onPollChange(
      newOptions.some(o => o.trim())
        ? { options: newOptions, duration: newDuration }
        : null
    );
  };

  const setOption = (i: number, val: string): void => {
    const next = [...options];
    next[i] = val;
    setOptions(next);
    update(next, duration);
  };

  const addOption = (): void => {
    if (options.length >= 4) return;
    const next = [...options, ''];
    setOptions(next);
    update(next, duration);
  };

  const removeOption = (i: number): void => {
    if (options.length <= 2) return;
    const next = options.filter((_, idx) => idx !== i);
    setOptions(next);
    update(next, duration);
  };

  const setDur = (h: number): void => {
    setDuration(h);
    update(options, h);
  };

  return (
    <div className='mt-2 flex flex-col gap-2 rounded-2xl border border-[#2f2f3a] p-3'>
      <p className='text-xs font-bold text-amber-500'>Poll</p>
      {options.map((opt, i) => (
        <div key={i} className='flex items-center gap-2'>
          <input
            className='flex-1 rounded-lg border border-[#2f2f3a] bg-[#1a1a24] px-3 py-1.5 text-sm 
                       text-white placeholder-[#71767B] outline-none focus:border-amber-500'
            placeholder={i < 2 ? `Choice ${i + 1}` : `Choice ${i + 1} (optional)`}
            value={opt}
            maxLength={25}
            onChange={e => setOption(i, e.target.value)}
          />
          {i >= 2 && (
            <Button
              className='p-1 text-[#71767B] hover:text-red-400'
              type='button'
              onClick={() => removeOption(i)}
            >
              <HeroIcon className='h-4 w-4' iconName='XMarkIcon' />
            </Button>
          )}
        </div>
      ))}
      <div className='flex items-center justify-between'>
        {options.length < 4 && (
          <button
            type='button'
            className='text-xs font-bold text-amber-500 hover:text-amber-400'
            onClick={addOption}
          >
            + Add choice
          </button>
        )}
        <div className='ml-auto flex items-center gap-2'>
          <span className='text-xs text-[#71767B]'>Duration:</span>
          <select
            className='rounded bg-[#1a1a24] px-2 py-1 text-xs text-white outline-none'
            value={duration}
            onChange={e => setDur(Number(e.target.value))}
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={24}>1 day</option>
            <option value={72}>3 days</option>
            <option value={168}>7 days</option>
          </select>
        </div>
      </div>
    </div>
  );
}
