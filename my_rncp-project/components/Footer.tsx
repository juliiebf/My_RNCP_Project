import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#030712', borderTop: '1px solid #1f2937', color: '#9ca3af' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 12px 12px 12px' }}>

        {/* Top section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '12px' }}>

          {/* Logo + description */}
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', background: 'linear-gradient(to right, #facc15, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>
              MyShelf
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#6b7280' }}>
              Découvrez, suivez et gérez vos films et séries préférés en un seul endroit.
            </p>
          </div>

          {/* Films */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Films
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { href: '/movies/popular', label: 'Les plus populaires' },
                { href: '/movies/latest', label: 'Dernières sorties' },
                { href: '/movies/genre/28-action', label: 'Action' },
                { href: '/movies/genre/35-comédie', label: 'Comédie' },
                { href: '/movies/genre/18-drame', label: 'Drame' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Séries */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Séries
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { href: '/tvshows/popular', label: 'Les plus populaires' },
                { href: '/tvshows/latest', label: 'Nouvelles séries' },
                { href: '/tvshows/genre/18-drame', label: 'Drame' },
                { href: '/tvshows/genre/35-comédie', label: 'Comédie' },
                { href: '/tvshows/genre/80-crime', label: 'Crime' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              À propos
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { href: '/about', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Confidentialité' },
                { href: '/terms', label: "Conditions d'utilisation" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: '#4b5563', textAlign: 'center' }}>
            © {new Date().getFullYear()} MyShelf. Données fournies par{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{ color: '#facc15', textDecoration: 'none' }}>
              TMDB
            </a>
            . Ce site n&apos;est pas affilié à TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
