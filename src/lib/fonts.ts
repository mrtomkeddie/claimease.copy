import localFont from 'next/font/local';
import { Inter, Poppins } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const gilroyHeavy = localFont({
  src: [
    { path: '../../public/Gilroy-Heavy.woff2', weight: '900', style: 'normal' },
    { path: '../../public/Gilroy-Heavy.ttf', weight: '900', style: 'normal' },
  ],
  display: 'swap',
});
