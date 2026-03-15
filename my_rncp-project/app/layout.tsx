import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'MyShelf - Track your movies & TV shows',
  description: 'Create lists, rate and discover your favorite movies and TV shows',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-white">
        <Header />
        <main className="flex-1 w-full px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
