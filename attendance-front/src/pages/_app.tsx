import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

// 型定義
interface AppProps {
  Component: React.ComponentType;
  pageProps: any;
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // リダイレクト処理
    if (router.pathname === '/') {
      router.push('/Login');
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
