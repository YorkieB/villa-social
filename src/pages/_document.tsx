import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(): JSX.Element {
  return (
    // Villa defaults to dark mode — class set server-side to prevent flash of white
    <Html lang='en' className='dark'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
