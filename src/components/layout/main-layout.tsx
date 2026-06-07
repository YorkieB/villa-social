import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { fetchJSON } from '@lib/fetch';
import { WindowContextProvider } from '@lib/context/window-context';
import { Sidebar } from '@components/sidebar/sidebar';
import { Aside } from '@components/aside/aside';
import { AsideTrends } from '@components/aside/aside-trends';
import { Suggestions } from '@components/aside/suggestions';
import type { DefaultToastOptions } from 'react-hot-toast';
import type { LayoutProps } from './common-layout';

const toastOptions: DefaultToastOptions = {
  style: {
    color: 'white',
    borderRadius: '4px',
    backgroundColor: 'rgb(var(--main-accent))'
  },
  success: { duration: 4000 }
};

export function MainLayout({ children }: LayoutProps): JSX.Element {
  return (
    <div className='flex w-full justify-center gap-0 lg:gap-4 bg-main-background min-h-screen'>
      <WindowContextProvider>
        {/* Column 1: Left Navigation Sidebar */}
        <Sidebar />
        
        {/* Column 2: Central Feed Column */}
        <main className='flex-1 max-w-2xl border-x border-light-border/40 dark:border-dark-border/40 min-h-screen'>
          <SWRConfig value={{ fetcher: fetchJSON }}>
            {children}
          </SWRConfig>
        </main>

        {/* Column 3: Right Sidebar with Modern Floating Frosted Cards */}
        <Aside>
          <div className='flex flex-col gap-4 bg-transparent'>
            <AsideTrends />
            <Suggestions />
          </div>
        </Aside>
      </WindowContextProvider>

      <Toaster
        position='bottom-center'
        toastOptions={toastOptions}
        containerClassName='mb-12 xs:mb-0'
      />
    </div>
  );
}
