import Head from 'next/head';

export function AppHead(): JSX.Element {
  return (
    <Head>
      <title>Villa</title>
      <meta name='og:title' content='Villa — Your place in the music' />
      <link rel='icon' href='/favicon.ico' />
      <link rel='manifest' href='/site.webmanifest' key='site-manifest' />
    </Head>
  );
}
