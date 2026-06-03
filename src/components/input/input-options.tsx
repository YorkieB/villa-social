import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from './input';
import { ProgressBar } from './progress-bar';
import { EmojiPicker } from './emoji-picker';
import { GifPicker } from './gif-picker';
import { PollInput } from './poll-input';
import type { ChangeEvent, ClipboardEvent } from 'react';
import type { IconName } from '@components/ui/hero-icon';
import type { PollData } from './poll-input';

type InputOptionsProps = {
  reply?: boolean;
  modal?: boolean;
  inputLimit: number;
  inputLength: number;
  isValidTweet: boolean;
  isCharLimitExceeded: boolean;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
  onEmojiInsert?: (emoji: string) => void;
  onGifSelect?: (url: string, previewUrl: string) => void;
  onPollChange?: (poll: PollData | null) => void;
  onScheduleChange?: (date: string) => void;
  onLocationChange?: (location: string) => void;
  scheduledAt?: string;
  location?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function InputOptions({
  reply,
  modal,
  inputLimit,
  inputLength,
  isValidTweet,
  isCharLimitExceeded,
  handleImageUpload,
  onEmojiInsert,
  onGifSelect,
  onPollChange,
  onScheduleChange,
  onLocationChange,
  scheduledAt,
  location
}: InputOptionsProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [showPoll, setShowPoll] = useState(false);

  const handleMediaClick = (): void => inputFileRef.current?.click();

  const handleEmojiClick = useCallback((emoji: string): void => {
    onEmojiInsert?.(emoji);
    setShowEmoji(false);
  }, [onEmojiInsert]);

  const handleGifSelect = useCallback((url: string, preview: string): void => {
    onGifSelect?.(url, preview);
    setShowGif(false);
  }, [onGifSelect]);

  const handleLocation = (): void => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json() as { address: { city?: string; town?: string; county?: string; country?: string } };
        const place =
          data.address.city ||
          data.address.town ||
          data.address.county ||
          data.address.country ||
          `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        onLocationChange?.(place);
      } catch {
        onLocationChange?.(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    });
  };

  const handleScheduleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onScheduleChange?.(e.target.value);
  };

  // Min datetime = now + 5 min
  const minDateTime = new Date(Date.now() + 5 * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <motion.div className='flex flex-col gap-2' {...variants}>
      {/* Poll UI */}
      {showPoll && onPollChange && (
        <PollInput onPollChange={onPollChange} />
      )}

      {/* Schedule picker */}
      {scheduledAt !== undefined && (
        <div className='flex items-center gap-2'>
          <HeroIcon className='h-4 w-4 text-amber-500' iconName='CalendarDaysIcon' />
          <input
            type='datetime-local'
            className='rounded-lg border border-[#2f2f3a] bg-[#1a1a24] px-3 py-1 text-xs text-white outline-none focus:border-amber-500'
            min={minDateTime}
            value={scheduledAt}
            onChange={handleScheduleChange}
          />
          {scheduledAt && (
            <button
              type='button'
              className='text-xs text-[#71767B] hover:text-red-400'
              onClick={() => onScheduleChange?.('')}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Location tag */}
      {location && (
        <div className='flex items-center gap-1.5 rounded-full border border-amber-500/30 px-3 py-1 text-xs text-amber-500 w-fit'>
          <HeroIcon className='h-3.5 w-3.5' iconName='MapPinIcon' />
          {location}
          <button
            type='button'
            className='ml-1 text-[#71767B] hover:text-red-400'
            onClick={() => onLocationChange?.('')}
          >
            ✕
          </button>
        </div>
      )}

      <div className='flex justify-between'>
        <div className='relative flex text-main-accent xs:[&>button:nth-child(n+6)]:hidden md:[&>button]:!block [&>button:nth-child(n+4)]:hidden'>
          <input
            className='hidden'
            type='file'
            accept='image/*,video/*'
            onChange={handleImageUpload}
            ref={inputFileRef}
            multiple
          />

          {/* Media */}
          <Button
            className='accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20'
            onClick={handleMediaClick}
            type='button'
          >
            <HeroIcon className='h-5 w-5' iconName='PhotoIcon' />
            <ToolTip tip='Media' modal={modal} />
          </Button>

          {/* GIF */}
          <div className='relative'>
            <Button
              className='accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20'
              onClick={() => { setShowGif(v => !v); setShowEmoji(false); }}
              type='button'
            >
              <HeroIcon className='h-5 w-5' iconName='GifIcon' />
              <ToolTip tip='GIF' modal={modal} />
            </Button>
            {showGif && onGifSelect && (
              <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGif(false)} />
            )}
          </div>

          {/* Poll — hidden in reply mode */}
          {!reply && (
            <Button
              className='accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20'
              onClick={() => setShowPoll(v => !v)}
              type='button'
            >
              <HeroIcon className='h-5 w-5' iconName='ChartBarIcon' />
              <ToolTip tip='Poll' modal={modal} />
            </Button>
          )}

          {/* Emoji */}
          <div className='relative'>
            <Button
              className='accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20'
              onClick={() => { setShowEmoji(v => !v); setShowGif(false); }}
              type='button'
            >
              <HeroIcon className='h-5 w-5' iconName='FaceSmileIcon' />
              <ToolTip tip='Emoji' modal={modal} />
            </Button>
            {showEmoji && (
              <EmojiPicker onEmojiClick={handleEmojiClick} onClose={() => setShowEmoji(false)} />
            )}
          </div>

          {/* Schedule — hidden in reply mode */}
          {!reply && (
            <Button
              className='accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20'
              onClick={() => onScheduleChange?.(scheduledAt ? '' : minDateTime)}
              type='button'
            >
              <HeroIcon className='h-5 w-5' iconName='CalendarDaysIcon' />
              <ToolTip tip='Schedule' modal={modal} />
            </Button>
          )}

          {/* Location */}
          <Button
            className='accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20'
            onClick={handleLocation}
            type='button'
          >
            <HeroIcon className='h-5 w-5' iconName='MapPinIcon' />
            <ToolTip tip='Location' modal={modal} />
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <motion.div
            className='flex items-center gap-4'
            animate={inputLength ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          >
            <ProgressBar
              modal={modal}
              inputLimit={inputLimit}
              inputLength={inputLength}
              isCharLimitExceeded={isCharLimitExceeded}
            />
            {!reply && (
              <>
                <i className='hidden h-8 w-[1px] bg-[#B9CAD3] dark:bg-[#3E4144] xs:block' />
                <Button
                  className='group relative hidden rounded-full border border-light-line-reply p-[1px]
                             text-main-accent dark:border-light-secondary xs:block'
                  disabled
                  type='button'
                >
                  <HeroIcon className='h-5 w-5' iconName='PlusIcon' />
                  <ToolTip tip='Add' modal={modal} />
                </Button>
              </>
            )}
          </motion.div>

          <Button
            type='submit'
            className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                       enabled:hover:bg-main-accent/90 enabled:active:bg-main-accent/75'
            disabled={!isValidTweet}
          >
            {reply ? 'Reply' : 'Post'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
