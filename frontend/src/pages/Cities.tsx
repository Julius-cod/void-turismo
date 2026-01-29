import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { destinationsApi, Destination, BACKEND_URL } from '@/lib/api';

export default function Cities() {
  const { t } = useLanguage();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const res: any = await destinationsApi.list();
        setDestinations(res.data);
      } catch (e) {
        setError('Erro ao carregar destinos');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide">

          <h1 className="font-serif text-4xl font-bold mb-4">
            {t('nav.cities')}
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            Explore Angola's beautiful cities and regions
          </p>

          {loading && <p>A carregar destinos...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {destinations.map((city) => (
                <Link
                  key={city.id}
                  to={`/destinations/${city.slug}`}
                  className="bg-card rounded-2xl shadow-card overflow-hidden hover:scale-[1.02] transition"
                >
                  {city.image_url && (
                    <img
                      src={city.image_url ? `${BACKEND_URL}${city.image_url}` : undefined}
                      alt={city.name}
                      className="w-full h-40 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {city.name}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {city.description}
                    </p>
                  </div>
                </Link>
              ))}

              {destinations.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground">
                  Nenhum destino encontrado
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
