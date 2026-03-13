import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export const metadata: Metadata = {
  title: 'MyShelf - Gérez vos films et séries',
  description: 'Créez des listes, notez et partagez vos films et séries préférés',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Header />
        <main className="w-full px-4 min-h-[80vh]">
          {children}
        </main>
        <footer className="bg-black/50 border-t border-gray-800 text-gray-400 py-6 text-center" style={{ marginTop: '12px' }}>
          <p>© 2026 MyShelf </p>
        </footer>
        <Footer />
      </body>
    </html>
  );
}
