import '@styles/globals.scss';

import { AuthContextProvider } from '@lib/context/auth-context';
import { ThemeContextProvider } from '@lib/context/theme-context';
import { AppHead } from '@components/common/app-head';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps
}: AppPropsWithLayout): ReactNode {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);

  return (
    <>
      {/* 
        Inline script runs before React hydration — forces dark mode and amber accent
        immediately, preventing any flash of white / Twitter blue.
        This is the canonical Next.js pattern for blocking theme scripts.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var root = document.documentElement;
                // Always add dark class — Villa is dark by default
                root.classList.add('dark');
                // Force Villa amber accent
                root.style.setProperty('--main-accent', 'var(--accent-yellow)');
                root.style.setProperty('--main-background', 'var(--dark-background)');
                root.style.setProperty('--main-search-background', 'var(--dark-search-background)');
                root.style.setProperty('--main-sidebar-background', 'var(--dark-sidebar-background)');
                // Respect saved theme if user explicitly chose one
                var saved = localStorage.getItem('theme');
                if (saved === 'light') {
                  root.classList.remove('dark');
                  root.style.setProperty('--main-background', 'var(--light-background)');
                  root.style.setProperty('--main-search-background', 'var(--light-search-background)');
                  root.style.setProperty('--main-sidebar-background', 'var(--light-sidebar-background)');
                } else if (saved === 'dim') {
                  root.style.setProperty('--main-background', 'var(--dim-background)');
                  root.style.setProperty('--main-search-background', 'var(--dim-search-background)');
                  root.style.setProperty('--main-sidebar-background', 'var(--dim-sidebar-background)');
                }
                // Respect saved accent
                var accent = localStorage.getItem('accent') || 'yellow';
                root.style.setProperty('--main-accent', 'var(--accent-' + accent + ')');
              } catch(e) {}
            })();
          `
        }}
      />
      <AppHead />
      <AuthContextProvider>
        <ThemeContextProvider>
          {getLayout(<Component {...pageProps} />)}
        </ThemeContextProvider>
      </AuthContextProvider>
    </>
  );
}
