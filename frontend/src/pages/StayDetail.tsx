import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { accommodationsApi, Accommodation, BACKEND_URL } from '@/lib/api';

export default function StayDetail() {
  const { slug } = useParams();

  const [stay, setStay] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchStay = async () => {
      try {
        setLoading(true);
        const res: any = await accommodationsApi.get(slug);
        setStay(res.data);
      } catch (e) {
        setError('Erro ao carregar hospedagem');
      } finally {
        setLoading(false);
      }
    };

    fetchStay();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide">

          {loading && <p>A carregar...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && stay && (
            <>
              {stay.image_url && (
                <img
                   src={stay.image_url ? `${BACKEND_URL}${stay.image_url}` : undefined}
                  alt={stay.name}
                  className="w-full h-[400px] object-cover rounded-2xl mb-8"
                />
              )}

              <h1 className="font-serif text-4xl font-bold mb-4">
                {stay.name}
              </h1>

              <p className="text-muted-foreground mb-6">
                {stay.destination?.name}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-2xl shadow-card">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-xl font-semibold">
                    {stay.price_per_night} {stay.currency} / night
                  </p>
                </div>

                <div className="bg-card p-6 rounded-2xl shadow-card">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-xl font-semibold">
                    ⭐ {stay.rating || 'N/A'}
                  </p>
                </div>

                <div className="bg-card p-6 rounded-2xl shadow-card">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-xl font-semibold">
                    {stay.listing_type}
                  </p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl shadow-card">
                <h2 className="font-semibold text-2xl mb-4">
                  About this stay
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {stay.description}
                </p>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
