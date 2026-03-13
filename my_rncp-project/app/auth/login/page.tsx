'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur de connexion');
        setLoading(false);
        return;
      }


      // Notifie la Navbar du changement
      window.dispatchEvent(new Event('auth-change'));
      
      // Redirige vers l'accueil
      router.push('/');
    } catch (err) {
      setError('Erreur serveur');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">

      {/* Card */}
      <div
        style={{ paddingTop: '20px', paddingBottom: '40px', paddingLeft: '10px', paddingRight: '10px' }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-xl"
      >

        {/* Title */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-2">
          Connexion
        </h1>
        <p className="text-gray-400 text-sm text-center mb-10">
          Connectez-vous pour accéder à votre compte
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 text-sm">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8">

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '12px 0' }}
              className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
              placeholder="votre@email.com"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px 0' }}
              className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '14px' }}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">Ou</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          style={{ padding: '14px' }}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all flex items-center justify-center gap-3 font-semibold text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Se connecter avec Google
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Pas encore de compte ?{' '}
          <a href="/auth/register" className="text-yellow-400 hover:text-yellow-300 font-medium hover:underline transition-colors">
            S&apos;inscrire
          </a>
        </p>
      </div>
    </div>
  );
}