import type {Metadata} from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'NODE_LEARN OS',
  description: 'Modular Learning OS',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased min-h-screen flex items-center justify-center p-4 md:p-8" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
