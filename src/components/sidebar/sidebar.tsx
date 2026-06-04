import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { useWindow } from '@lib/context/window-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { VillaLogo } from '@components/ui/villa-logo';
import { Button } from '@components/ui/button';
import { SidebarLink } from './sidebar-link';
import { MoreSettings } from './more-settings';
import { SidebarProfile } from './sidebar-profile';
import type { IconName } from '@components/ui/hero-icon';

export type NavLink = {
  href: string;
  linkName: string;
  iconName: IconName;
  disabled?: boolean;
  canBeHidden?: boolean;
};

const navLinks: Readonly<NavLink[]> = [
  {
    href: '/home',
    linkName: 'Home',
    iconName: 'HomeIcon'
  },
  {
    href: '/explore',
    linkName: 'Explore',
    iconName: 'MagnifyingGlassIcon',
    disabled: true,
    canBeHidden: true
  },
  {
    href: '/notifications',
    linkName: 'Notifications',
    iconName: 'BellIcon',
    disabled: true
  },
  {
    href: '/messages',
    linkName: 'Messages',
    iconName: 'EnvelopeIcon'
  },
  {
    href: '/bookmarks',
    linkName: 'Bookmarks',
    iconName: 'BookmarkIcon',
    canBeHidden: true
  },
  {
    href: '/lists',
    linkName: 'Lists',
    iconName: 'Bars3BottomLeftIcon',
    disabled: true,
    canBeHidden: true
  }
];

export function Sidebar(): JSX.Element {
  const { user } = useAuth();
  const { isMobile } = useWindow();
  const { open, openModal, closeModal } = useModal();
  const username = user?.username as string;

  return (
    <header
      id='sidebar'
      className='flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24
                 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-[280px] xl:justify-end'
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <Input modal closeModal={closeModal} />
      </Modal>

      <div
        className='fixed bottom-0 z-10 flex w-full flex-col justify-between
                   border-t border-light-border/60 bg-main-sidebar-background py-0
                   dark:border-dark-border/60 dark:bg-main-sidebar-background
                   xs:top-0 xs:h-full xs:w-auto xs:border-0 xs:border-r
                   xs:border-light-border/40 dark:xs:border-dark-border/40
                   xs:bg-main-sidebar-background xs:px-3 xs:py-4
                   xl:w-[280px] xl:px-4'
      >
        {/* ── Logo ── */}
        <section className='flex flex-col gap-1 xs:items-center xl:items-stretch'>
          <h1 className='hidden xs:flex mb-2 xl:mb-4'>
            <Link href='/home'>
              <a
                className='group flex items-center gap-3 rounded-xl px-3 py-2.5
                           transition-colors duration-200
                           hover:bg-main-accent/10 focus-visible:bg-main-accent/10
                           focus-visible:ring-2 focus-visible:ring-main-accent/40 outline-none'
              >
                <VillaLogo className='h-7 w-7 text-main-accent' />
                <span className='hidden xl:block text-xl font-bold tracking-tight
                                 text-light-primary dark:text-dark-primary'>
                  Villa
                </span>
              </a>
            </Link>
          </h1>

          {/* ── Nav ── */}
          <nav className='flex items-center justify-around xs:flex-col xs:justify-center xl:block xl:space-y-0.5'>
            {navLinks.map(({ ...linkData }) => (
              <SidebarLink {...linkData} key={linkData.href} />
            ))}
            <SidebarLink
              href={`/user/${username}`}
              username={username}
              linkName='Profile'
              iconName='UserIcon'
            />
            {!isMobile && <MoreSettings />}
          </nav>

          {/* ── Post CTA ── */}
          <Button
            className='accent-tab mt-3 flex items-center justify-center gap-2 rounded-xl
                       bg-main-accent px-4 py-3 font-semibold text-white outline-none
                       transition-all duration-150 hover:brightness-110 active:scale-[0.97]
                       xs:mt-2 xl:mt-4 xl:w-full'
            onClick={openModal}
          >
            {/* Icon-only on narrow sidebar, full label on xl */}
            <span className='text-xl xl:hidden'>+</span>
            <span className='hidden xl:block'>Post</span>
          </Button>
        </section>

        {!isMobile && <SidebarProfile />}
      </div>
    </header>
  );
}
