import { CustomIcon } from '@components/ui/custom-icon';
import { SEO } from './seo';

export function Placeholder(): JSX.Element {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <SEO
        title='Villa'
        description='Your place in the music. Join Villa by KM Music Group.'
        image='/home.png'
      />
      <i>
        <CustomIcon
          className='h-20 w-20'
          iconName='TwitterIcon'
        />
      </i>
    </main>
  );
}
