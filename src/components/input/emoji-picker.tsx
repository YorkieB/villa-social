import { useState, useEffect, useRef } from 'react';
import type { EmojiClickData } from 'emoji-picker-react';

type EmojiPickerProps = {
  onEmojiClick: (emoji: string) => void;
  onClose: () => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function EmojiPicker({ onEmojiClick, onClose }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [Picker, setPicker] = useState<React.ComponentType<{
    onEmojiClick: (data: EmojiClickData) => void;
    theme: string;
    skinTonesDisabled: boolean;
    width: number;
    height: number;
  }> | null>(null);

  useEffect(() => {
    import('emoji-picker-react').then((mod) => setPicker(() => mod.default));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className='absolute bottom-12 left-0 z-50'
      style={{ filter: 'drop-shadow(0 4px 24px rgba(245,158,11,0.2))' }}
    >
      {Picker ? (
        <Picker
          onEmojiClick={(data) => onEmojiClick(data.emoji)}
          theme='dark'
          skinTonesDisabled
          width={320}
          height={380}
        />
      ) : (
        <div className='flex h-12 items-center justify-center rounded-2xl bg-[#1a1a24] px-6 text-sm text-amber-500'>
          Loading…
        </div>
      )}
    </div>
  );
}
