import { useAuth } from '@lib/context/auth-context';
import { CustomIcon } from '@components/ui/custom-icon';
import { VillaLogo } from '@components/ui/villa-logo';
import { Button } from '@components/ui/button';

export function LoginMain(): JSX.Element {
  const { signInWithGoogle } = useAuth();

  return (
    <main className='grid lg:grid-cols-[1fr,45vw]'>
      <div
        className='relative hidden items-center justify-center lg:flex'
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111100 100%)'
        }}
      >
        <div className='flex flex-col items-center gap-6 p-12'>
          <VillaLogo size={120} />
          <h1
            className='text-6xl font-black tracking-widest'
            style={{ color: '#f59e0b', fontFamily: 'Inter, sans-serif' }}
          >
            VILLA
          </h1>
          <p
            className='text-lg font-medium tracking-wide'
            style={{ color: '#71767B' }}
          >
            KM Music Group
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center justify-between gap-6 p-8 lg:items-start lg:justify-center'>
        <i className='mb-0 self-center lg:mb-10 lg:self-auto'>
          <CustomIcon
            className='-mt-4 h-6 w-6 lg:h-12 lg:w-12'
            iconName='TwitterIcon'
          />
        </i>
        <div className='flex max-w-xs flex-col gap-4 font-inter lg:max-w-none lg:gap-16'>
          <h1
            className='text-3xl font-black lg:text-6xl'
            style={{ lineHeight: 1.1 }}
          >
            Your place in the music.
          </h1>
          <h2 className='hidden text-xl font-bold lg:block lg:text-3xl'>
            Join Villa today.
          </h2>
        </div>
        <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
          <div className='grid gap-3 font-bold'>
            <Button
              className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                         hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                         dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
              onClick={signInWithGoogle}
            >
              <CustomIcon iconName='GoogleIcon' /> Sign up with Google
            </Button>
            <div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-2'>
              <i className='border-b border-light-border dark:border-dark-border' />
              <p>or</p>
              <i className='border-b border-light-border dark:border-dark-border' />
            </div>
            <Button
              className='cursor-not-allowed bg-main-accent text-white transition hover:brightness-90
                         focus-visible:!ring-main-accent/80 focus-visible:brightness-90 active:brightness-75'
            >
              Sign up with phone or email
            </Button>
            <p
              className='text-center text-xs text-light-secondary dark:text-dark-secondary'
            >
              By signing up, you agree to Villa&apos;s Terms of Service and
              Privacy Policy.
            </p>
          </div>
          <div className='flex flex-col gap-3'>
            <p className='font-bold'>Already have an account? </p>
            <Button
              className='border border-light-line-reply font-bold text-main-accent hover:bg-main-accent/10
                         focus-visible:bg-main-accent/10 focus-visible:!ring-main-accent/80 active:bg-main-accent/20
                         dark:border-light-secondary'
              onClick={signInWithGoogle}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
