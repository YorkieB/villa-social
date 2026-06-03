import { useAuth } from '@lib/context/auth-context';
import { CustomIcon } from '@components/ui/custom-icon';
import { VillaLogo } from '@components/ui/villa-logo';
import { Button } from '@components/ui/button';

export function LoginMain(): JSX.Element {
  const { signInWithGoogle } = useAuth();

  return (
    <main
      className='grid min-h-screen lg:grid-cols-[1fr,45vw]'
      style={{ backgroundColor: '#0a0a0e' }}
    >
      {/* Left panel — dark brand */}
      <div
        className='relative hidden items-center justify-center lg:flex'
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111100 100%)' }}
      >
        <div className='flex flex-col items-center gap-6 p-12'>
          <VillaLogo size={120} />
          <h1
            className='text-6xl font-black tracking-widest'
            style={{ color: '#f59e0b', fontFamily: 'Inter, sans-serif' }}
          >
            VILLA
          </h1>
          <p className='text-lg font-medium tracking-wide' style={{ color: '#71767B' }}>
            KM Music Group
          </p>
        </div>
      </div>

      {/* Right panel — dark */}
      <div
        className='flex flex-col items-center justify-between gap-6 p-8 lg:items-start lg:justify-center'
        style={{ backgroundColor: '#0e0e14' }}
      >
        {/* Mobile logo */}
        <i className='mb-0 self-center lg:mb-10 lg:self-auto'>
          <CustomIcon
            className='-mt-4 h-6 w-6 text-amber-500 lg:h-12 lg:w-12'
            iconName='TwitterIcon'
          />
        </i>

        <div className='flex max-w-xs flex-col gap-4 font-inter lg:max-w-none lg:gap-16'>
          <h1
            className='text-3xl font-black lg:text-6xl'
            style={{ lineHeight: 1.1, color: '#E7E9EA' }}
          >
            Your place in the music.
          </h1>
          <h2
            className='hidden text-xl font-bold lg:block lg:text-3xl'
            style={{ color: '#E7E9EA' }}
          >
            Join Villa today.
          </h2>
        </div>

        <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
          <div className='grid gap-3 font-bold'>
            {/* Google sign-in */}
            <Button
              className='flex justify-center gap-2 border font-bold transition-colors
                         hover:bg-white/5 active:bg-white/10'
              style={{ borderColor: '#3a3a4a', backgroundColor: 'transparent', color: '#E7E9EA' }}
              onClick={signInWithGoogle}
            >
              <CustomIcon iconName='GoogleIcon' /> Sign up with Google
            </Button>

            {/* Divider */}
            <div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-2'>
              <i className='border-b' style={{ borderColor: '#2F3336' }} />
              <p style={{ color: '#71767B' }}>or</p>
              <i className='border-b' style={{ borderColor: '#2F3336' }} />
            </div>

            {/* Email placeholder */}
            <Button
              className='cursor-not-allowed font-bold text-white transition hover:brightness-90
                         active:brightness-75'
              style={{ backgroundColor: '#f59e0b' }}
            >
              Sign up with phone or email
            </Button>

            <p className='text-center text-xs' style={{ color: '#71767B' }}>
              By signing up, you agree to Villa&apos;s Terms of Service and Privacy Policy.
            </p>
          </div>

          <div className='flex flex-col gap-3'>
            <p className='font-bold' style={{ color: '#E7E9EA' }}>
              Already have an account?
            </p>
            <Button
              className='border font-bold transition hover:bg-amber-500/10 active:bg-amber-500/20'
              style={{ borderColor: '#f59e0b', color: '#f59e0b', backgroundColor: 'transparent' }}
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
