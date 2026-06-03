import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { EmojiClickData } from 'emoji-picker-react';

const EmojiPickerLib = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className='flex h-64 w-72 items-center justify-center rounded-2xl bg-main-sidebar-background text-secondary'>
      Loading…
    </div>
  )
});

type EmojiPickerProps = {
  onEmojiClick: (emoji: string) => void;
  onClose: () => void;
};

export function EmojiPicker({ onEmojiClick, onClose }: EmojiPickerProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function handleEmojiClick(data: EmojiClickData): void {
    onEmojiClick(data.emoji);
    onClose();
  }

  return (
    <div
      ref={ref}
      className='absolute bottom-12 left-0 z-50 rounded-2xl shadow-xl'
    >
      <EmojiPickerLib
        onEmojiClick={handleEmojiClick}
        theme={'dark' as never}
        skinTonesDisabled
        width={320}
        height={380}
      />
    </div>
  );
}
