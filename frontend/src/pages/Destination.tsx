import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

import { destinationsApi, BACKEND_URL } from '@/lib/api';
import type { Destination } from '@/lib/api';

export default function DestinationPage() {
  const { slug } = useParams<{ slug: string }>();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    console.log('Fetching destination with slug:', slug);

    setLoading(true);
    setError(null);

    destinationsApi
      .get(slug)
      .then((res) => {
        console.log('Destination response:', res);
        setDestination(res.data);
      })
      .catch((err) => {
        console.error('Erro ao carregar destino:', err);
        setError('Destino não encontrado');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide">
          {/* Loading */}
          {loading && (
            <p className="text-muted-foreground">Carregando destino...</p>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 font-medium">{error}</p>
          )}

          {/* Content */}
          {destination && (
            <div className="space-y-6">
              {/* Image */}
              {destination.image_url && (
                <div className="w-full h-[420px] rounded-2xl overflow-hidden">
                  <img
                    src={`${BACKEND_URL}${destination.image_url}`}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="font-serif text-4xl font-bold">
                {destination.name}
              </h1>

              {/* Region */}
              {destination.region && (
                <p className="text-muted-foreground text-sm uppercase tracking-wide">
                  {destination.region}
                </p>
              )}

              {/* Short description */}
              {destination.short_description && (
                <p className="text-lg text-muted-foreground">
                  {destination.short_description}
                </p>
              )}

              {/* Full description */}
              {destination.description && (
                <div className="prose prose-neutral max-w-none">
                  <p>{destination.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
