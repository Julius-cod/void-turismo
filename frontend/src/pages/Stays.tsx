import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { accommodationsApi, Accommodation, BACKEND_URL } from '@/lib/api';

export default function Stays() {
  const { t } = useLanguage();

  const [stays, setStays] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        const res: any = await accommodationsApi.list();
        setStays(res.data || []);
      } catch (e) {
        setError('Erro ao carregar hospedagens');
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide">
          <h1 className="font-serif text-4xl font-bold mb-4">
            {t('nav.stays')}
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            Find your perfect accommodation in Angola
          </p>

          {loading && <p>A carregar...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stays.map((stay) => (
                <Link
                  key={stay.id}
                  to={`/accommodations/${stay.slug}`}
                  className="bg-card rounded-2xl overflow-hidden shadow-card hover:scale-[1.02] transition"
                >
                  {stay.image_url && (
                    <img
                      src={stay.image_url ? `${BACKEND_URL}${stay.image_url}` : undefined}
                      alt={stay.name}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h2 className="font-semibold text-xl mb-2">
                      {stay.name}
                    </h2>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {stay.short_description}
                    </p>

                    <div className="flex justify-between text-sm">
                      <span>
                        {stay.price_per_night} {stay.currency} / night
                      </span>

                      <span>
                        ⭐ {stay.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
