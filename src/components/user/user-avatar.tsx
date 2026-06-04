import Link from 'next/link';
import cn from 'clsx';
import { NextImage } from '@components/ui/next-image';

type UserAvatarProps = {
  src: string;
  alt: string;
  size?: number;
  username?: string;
  className?: string;
  /** Shape of the avatar. 'square' = rounded-lg (Villa default), 'circle' = rounded-full (legacy) */
  shape?: 'square' | 'circle';
};

export function UserAvatar({
  src,
  alt,
  size,
  username,
  className,
  shape = 'square'
}: UserAvatarProps): JSX.Element {
  const pictureSize = size ?? 48;
  const imgRadius = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <Link href={username ? `/user/${username}` : '#'}>
      <a
        className={cn(
          'blur-picture flex self-start',
          !username && 'pointer-events-none',
          className
        )}
        tabIndex={username ? 0 : -1}
      >
        <NextImage
          useSkeleton
          imgClassName={imgRadius}
          width={pictureSize}
          height={pictureSize}
          src={src}
          alt={alt}
          key={src}
        />
      </a>
    </Link>
  );
}
