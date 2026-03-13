'use client';

import { useState, useEffect } from 'react';

interface WatchlistButtonProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
}

export default function WatchlistButton({ 
  mediaId, 
  mediaType, 
  title, 
  posterPath 
}: WatchlistButtonProps) {
  
  const [status, setStatus] = useState<'none' | 'wishlist'>('none');
  const [loading, setLoading] = useState(false);

  // Check status initial (uniquement wishlist)
    useEffect(() => {
  const initStatus = async () => {
    try {
      const res = await fetch(
        `/api/watchlist/status?mediaId=${mediaId}&mediaType=${mediaType}`,
        { credentials: 'include' }
      );
      const { status } = await res.json();
      setStatus(status || 'none');
    } catch {
      setStatus('none');
    }
  };
  initStatus();
}, [mediaId, mediaType]);

  const addToWatchlist = async () => {
    setLoading(true);
    
    try {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          mediaId, 
          mediaType, 
          title, 
          posterPath,
          status: 'wishlist'
        }),
      });
      
      setStatus('wishlist');
    } catch (error) {
      console.error('Watchlist error:', error);
    } finally {
      setLoading(false);
    }
  };

const markAsWatched = async () => {
  console.log('🟢 VU:', { mediaId, mediaType });
  
  setLoading(true);
  
  try {
    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        mediaId, mediaType, title, posterPath, 
        status: 'watched'  // ← FORCE watched
      }),
    });
    
    if (res.ok) {
      setStatus('none');  // ← FORCE none (plus de wishlist)
      console.log('✅ Supprimé de wishlist + ajouté vues');
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const removeFromWatchlist = async () => {
    setLoading(true);
    
    try {
      await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mediaId, mediaType }),
      });
      
      setStatus('none');
    } catch (error) {
      console.error('Remove error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex gap-2 mt-2" style={{ flexWrap: 'nowrap' }}>
    {/* Bouton "À voir" / Retirer */}
    <button
      onClick={status === 'wishlist' ? removeFromWatchlist : addToWatchlist}
      disabled={loading}
      style={{
        padding: '6px 10px',
        borderRadius: '999px',
        fontWeight: '600',
        fontSize: '12px',
        transition: 'all 0.2s ease',
        border: status === 'wishlist' ? '2px solid #3b82f6' : '2px solid transparent',
        background: status === 'wishlist' ? 'transparent' : '#3b82f6',
        color: status === 'wishlist' ? '#3b82f6' : '#fff',
        opacity: loading ? 0.5 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.3px',
      }}
    >
      {status === 'wishlist' ? ' - Supprimer de ma watchlist' : '+ Ajouter à ma watchlist'}
    </button>

    {/* Bouton "Marquer comme vu" */}
    <button
      onClick={markAsWatched}
      disabled={loading}
      style={{
        padding: '10px 28px',
        borderRadius: '999px',
        fontWeight: '600',
        fontSize: '15px',
        transition: 'all 0.2s ease',
        border: '2px solid #22c55e',
        background: status === 'wishlist' ? '#22c55e' : 'transparent',
        color: status === 'wishlist' ? '#fff' : '#22c55e',
        opacity: loading ? 0.5 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.3px',
      }}
    >
      {status === 'wishlist' ? ' Vu ' : 'Vu '}
    </button>
  </div>
);
}