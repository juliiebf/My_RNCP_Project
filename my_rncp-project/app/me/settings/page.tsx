'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Déconnexion : supprime le token côté client
  const handleLogout = async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/';
};

 // Suppression de compte : supprime le token côté client et appelle l'API pour supprimer le compte
  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    } else {
        const data = await res.json();
        setError(data.message || 'Erreur lors de la suppression');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
        <p className="text-gray-400 mb-10">Gère ton compte</p>

        {/* Déconnexion */}
<div style={{
  border: '1px solid #374151',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '16px',
}}>
  <h2 className="text-xl font-bold text-white mb-2">Session</h2>
  <p className="text-gray-400 text-sm mb-6">
    Tu seras déconnecté(e) de tous les appareils.
  </p>
  <button
    onClick={handleLogout}
    style={{
      padding: '10px 24px',
      borderRadius: '999px',
      border: '1px solid #4b5563',
      background: 'transparent',
      color: '#9ca3af',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
    }}
  >
    Se déconnecter
  </button>
</div>

        {/* Zone danger */}
        <div style={{
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          background: 'rgba(239, 68, 68, 0.05)',
        }}>
          <h2 className="text-xl font-bold text-red-400 mb-2">Supprimer le compte</h2>
          <p className="text-gray-400 text-sm mb-6">
            La suppression de ton compte est irréversible. Toutes tes données seront définitivement supprimées.
          </p>

          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                background: 'transparent',
                color: '#f87171',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Supprimer mon compte
            </button>
          ) : (
            <div>
              <p className="text-red-300 font-semibold mb-4">
                Es-tu sûr(e) ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '999px',
                    border: 'none',
                    background: '#ef4444',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Suppression...' : 'Oui, supprimer définitivement'}
                </button>
                <button
                  onClick={() => setConfirm(false)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '999px',
                    border: '1px solid #4b5563',
                    background: 'transparent',
                    color: '#9ca3af',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
