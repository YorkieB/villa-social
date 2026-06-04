/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, createContext, useContext } from 'react';
import { updateUserTheme } from '@lib/firebase/utils';
import { useAuth } from './auth-context';
import type { ReactNode, ChangeEvent } from 'react';
import type { Theme, Accent } from '@lib/types/theme';

type ThemeContext = {
  theme: Theme;
  accent: Accent;
  changeTheme: ({ target: { value } }: ChangeEvent<HTMLInputElement>) => void;
  changeAccent: ({ target: { value } }: ChangeEvent<HTMLInputElement>) => void;
};

export const ThemeContext = createContext<ThemeContext | null>(null);

type ThemeContextProviderProps = {
  children: ReactNode;
};

// ── Migration helpers ─────────────────────────────────────────────────────────
// Villa v2: force all users onto dark + teal unless they have already
// explicitly chosen a v2-era preference. We track this with a localStorage
// flag 'villa_v2_migrated'. Once set, we respect their choice.

const MIGRATION_KEY = 'villa_v2_migrated';

/** Remap legacy accent values to Villa v2 equivalents */
function migrateAccent(accent: Accent | null): Accent {
  if (!accent) return 'teal';
  // Blue was the old Twitter-style default — remap to teal
  if (accent === 'blue') return 'teal';
  return accent;
}

/** Remap legacy theme values — light → dark for first-time migration */
function migrateTheme(theme: Theme | null): Theme {
  if (!theme) return 'dark';
  // Light was the old Twitter-style default — remap to dark
  if (theme === 'light') return 'dark';
  return theme;
}

function setInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  // If already migrated, respect saved preference
  if (localStorage.getItem(MIGRATION_KEY)) {
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved ?? 'dark';
  }

  // First visit post-v2: migrate and mark done
  const saved = localStorage.getItem('theme') as Theme | null;
  const migrated = migrateTheme(saved);
  localStorage.setItem('theme', migrated);
  return migrated;
}

function setInitialAccent(): Accent {
  if (typeof window === 'undefined') return 'teal';

  // If already migrated, respect saved preference
  if (localStorage.getItem(MIGRATION_KEY)) {
    const saved = localStorage.getItem('accent') as Accent | null;
    return saved ?? 'teal';
  }

  // First visit post-v2: migrate and mark done
  const saved = localStorage.getItem('accent') as Accent | null;
  const migrated = migrateAccent(saved);
  localStorage.setItem('accent', migrated);
  // Mark migration complete after both theme + accent are set
  localStorage.setItem(MIGRATION_KEY, '1');
  return migrated;
}
// ─────────────────────────────────────────────────────────────────────────────

export function ThemeContextProvider({
  children
}: ThemeContextProviderProps): JSX.Element {
  const [theme, setTheme] = useState<Theme>(setInitialTheme);
  const [accent, setAccent] = useState<Accent>(setInitialAccent);

  const { user } = useAuth();
  const { id: userId, theme: userTheme, accent: userAccent } = user ?? {};

  // Sync from Firebase — apply migration before trusting saved values
  useEffect(() => {
    if (user && userTheme) {
      const migrated = migrateTheme(userTheme);
      setTheme(migrated);
      // If migration changed the value, persist it back to Firebase
      if (migrated !== userTheme) {
        void updateUserTheme(user.id, { theme: migrated });
      }
    }
  }, [userId, userTheme]);

  useEffect(() => {
    if (user && userAccent) {
      const migrated = migrateAccent(userAccent);
      setAccent(migrated);
      // If migration changed the value, persist it back to Firebase
      if (migrated !== userAccent) {
        void updateUserTheme(user.id, { accent: migrated });
      }
    }
  }, [userId, userAccent]);

  useEffect(() => {
    const flipTheme = (theme: Theme): NodeJS.Timeout | undefined => {
      const root = document.documentElement;
      const targetTheme = theme === 'dim' ? 'dark' : theme;

      if (targetTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');

      root.style.setProperty('--main-background', `var(--${theme}-background)`);
      root.style.setProperty('--main-search-background', `var(--${theme}-search-background)`);
      root.style.setProperty('--main-sidebar-background', `var(--${theme}-sidebar-background)`);

      if (user) {
        localStorage.setItem('theme', theme);
        return setTimeout(() => void updateUserTheme(user.id, { theme }), 500);
      }

      return undefined;
    };

    const timeoutId = flipTheme(theme);
    return () => clearTimeout(timeoutId);
  }, [userId, theme]);

  useEffect(() => {
    const flipAccent = (accent: Accent): NodeJS.Timeout | undefined => {
      const root = document.documentElement;
      root.style.setProperty('--main-accent', `var(--accent-${accent})`);

      if (user) {
        localStorage.setItem('accent', accent);
        return setTimeout(() => void updateUserTheme(user.id, { accent }), 500);
      }

      return undefined;
    };

    const timeoutId = flipAccent(accent);
    return () => clearTimeout(timeoutId);
  }, [userId, accent]);

  const changeTheme = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void =>
    setTheme(value as Theme);

  const changeAccent = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void =>
    setAccent(value as Accent);

  const value: ThemeContext = { theme, accent, changeTheme, changeAccent };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContext {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within an ThemeContextProvider');
  return context;
}
