import Link from 'next/link';
import cn from 'clsx';
import { motion } from 'framer-motion';
import { formatNumber } from '@lib/date';
import { preventBubbling } from '@lib/utils';
import { useTrends } from '@lib/api/trends';
import { Error } from '@components/ui/error';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { Loading } from '@components/ui/loading';
import type { Variants } from 'framer-motion';

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } }
};

type AsideTrendsProps = {
  inTrendsPage?: boolean;
};

export function AsideTrends({ inTrendsPage }: AsideTrendsProps): JSX.Element {
  const { data, loading } = useTrends(1, inTrendsPage ? 100 : 10, {
    refreshInterval: 30000
  });

  const { trends, location } = data ?? {};

  return (
    <section
      className={cn(
        !inTrendsPage &&
          'hover-animation rounded-3xl bg-main-sidebar-background/60 backdrop-blur-md border border-light-border/40 dark:border-dark-border/40 shadow-card'
      )}
    >
      {loading ? (
        <Loading />
      ) : trends ? (
        <motion.div
          className={cn('inner:px-4 inner:py-3', inTrendsPage && 'mt-0.5')}
          {...variants}
        >
          {!inTrendsPage && (
            <h2 className="text-xl font-extrabold">Trends for you</h2>
          )}
          {trends.map(({ name, query, tweet_volume, url }) => (
            <Link
              href={url}
              key={query}
              className="hover-animation accent-tab hover-card relative
                         flex flex-col gap-0.5"
              onClick={(e) => e.preventDefault()}
            >
              <div className="absolute right-2 top-2">
                <Button
                  className="hover-animation group relative p-2
                             hover:bg-main-accent/10 focus-visible:bg-main-accent/20
                             focus-visible:!ring-main-accent/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HeroIcon
                    className="h-5 w-5 text-light-secondary group-hover:text-main-accent
                               group-focus-visible:text-main-accent dark:text-dark-secondary"
                    iconName="EllipsisHorizontalIcon"
                  />
                  <ToolTip tip="More" />
                </Button>
              </div>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">
                Trending{' '}
                {location === 'Worldwide' || !location
                  ? 'Worldwide'
                  : `in ${location}`}
              </p>
              <p className="font-bold">{name}</p>
              {tweet_volume && (
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  {formatNumber(tweet_volume)} tweets
                </p>
              )}
            </Link>
          ))}
          {!inTrendsPage && (
            <Link
              href="/trends"
              className="custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent"
            >
              Show more
            </Link>
          )}
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}
