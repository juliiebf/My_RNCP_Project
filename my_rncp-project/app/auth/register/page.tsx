'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone || null,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de l\'inscription');
        setLoading(false);
        return;
      }

      // Redirige vers la page de connexion
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError('Erreur serveur');
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">

      {/* Card */}
      <div
        style={{ paddingTop: '20px', paddingBottom: '40px', paddingLeft: '10px', paddingRight: '10px' }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg"
      >

        {/* Title */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-2">
          Inscription
        </h1>
        <p className="text-gray-400 text-sm text-center mb-10">
          Créez votre compte pour commencer
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 text-sm">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">

          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Prénom *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                style={{ padding: '12px 0' }}
                className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Nom *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                style={{ padding: '12px 0' }}
                className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Nom d&apos;utilisateur *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{ padding: '12px 0' }}
              className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
              placeholder="johndoe"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ padding: '12px 0' }}
              className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ padding: '12px 0' }}
              className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Mot de passe *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ padding: '12px 0' }}
              className="w-full bg-transparent border-0 border-b-2 border-white text-white text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirmer mot de passe */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Confirmer le mot de passe *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
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
          onClick={handleGoogleRegister}
          style={{ padding: '14px' }}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all flex items-center justify-center gap-3 font-semibold text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          S&apos;inscrire avec Google
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Vous avez déjà un compte ?{' '}
          <a href="/auth/login" className="text-yellow-400 hover:text-yellow-300 font-medium hover:underline transition-colors">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
