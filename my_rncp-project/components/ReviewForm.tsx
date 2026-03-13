'use client';

import { useState } from 'react';

interface ReviewFormProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
}

export default function ReviewForm({ tmdbId, mediaType }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating <= 0) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId,
          mediaType,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      if (res.ok) {
        setMessage('Review ajoutée !');
        setRating(0);
        setComment('');

      } else {
        const data = await res.json();
        setMessage(`${data.message}`);
      }
    } catch (error) {
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 mx-auto max-w-2xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl border border-yellow-200 dark:border-yellow-900/50">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        👤 Ta review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-semibold mb-2 dark:text-gray-200">
            Note (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400"
          />
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {rating || '—'}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2 dark:text-gray-200">
            Ton avis
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Qu'as-tu pensé de ce film/série ? (optionnel)"
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-vertical"
            maxLength={500}
          />
          <div className="text-sm text-gray-500 mt-1">
            {comment.length}/500 caractères
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-sm font-medium ${
            message.startsWith('✅')
              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : 'Publier ma review'}
        </button>
      </form>
    </div>
  );
}
