import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'clsx';
import { preventBubbling } from '@lib/utils';
import { HeroIcon } from '@components/ui/hero-icon';
import type { NavLink } from './sidebar';

type SidebarLinkProps = NavLink & {
  username?: string;
};

export function SidebarLink({
  href,
  username,
  iconName,
  linkName,
  disabled,
  canBeHidden
}: SidebarLinkProps): JSX.Element {
  const { asPath } = useRouter();
  const isActive = username ? asPath.includes(username) : asPath === href;

  return (
    <Link href={href}>
      <a
        className={cn(
          'group py-0.5 outline-none',
          canBeHidden ? 'hidden xs:flex' : 'flex',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={disabled ? preventBubbling() : undefined}
      >
        <div
          className={cn(
            `relative flex items-center justify-center self-start
             rounded-xl p-3 text-[1.0625rem] leading-none transition-all duration-200
             group-hover:bg-main-accent/10 dark:group-hover:bg-main-accent/10
             group-focus-visible:ring-2 group-focus-visible:ring-main-accent/40`,
            isActive
              ? 'font-semibold text-main-accent'
              : 'font-medium text-light-primary dark:text-dark-primary'
          )}
        >
          {/* Teal left-bar indicator on active */}
          {isActive && (
            <span
              className='absolute left-0 top-1/2 -translate-y-1/2 h-5/6 w-[3px]
                         rounded-r-full bg-main-accent'
              aria-hidden='true'
            />
          )}

          <HeroIcon
            className={cn(
              'h-7 w-7 shrink-0 transition-transform duration-200 group-hover:scale-110',
              isActive ? 'text-main-accent' : 'text-light-primary dark:text-dark-primary'
            )}
            iconName={iconName}
            solid={isActive}
          />

          {/* Label: Visually hidden for icon-only look, but readable by screen readers */}
          <span className='sr-only'>{linkName}</span>
        </div>
      </a>
    </Link>
  );
}
  );
}
