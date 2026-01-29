import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { experiencesApi, Experience , BACKEND_URL} from '@/lib/api';

export default function Experiences() {
  const { t } = useLanguage();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const res: any = await experiencesApi.list();
        setExperiences(res.data || []);
      } catch (e) {
        setError('Erro ao carregar experiências');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide">
          <h1 className="font-serif text-4xl font-bold mb-4">
            {t('nav.experiences')}
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            Discover unique experiences across Angola
          </p>

          {loading && <p>A carregar...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <Link
                  key={exp.id}
                  to={`/experiences/${exp.slug}`}
                  className="bg-card rounded-2xl overflow-hidden shadow-card hover:scale-[1.02] transition"
                >
                  {exp.image_url && (
                    <img
                      src={exp.image_url ? `${BACKEND_URL}${exp.image_url}` : undefined}
                      alt={exp.name}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h2 className="font-semibold text-xl mb-2">
                      {exp.name}
                    </h2>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {exp.short_description}
                    </p>

                    <div className="flex justify-between text-sm">
                      <span>
                        {exp.price} {exp.currency}
                      </span>

                      <span>
                        ⭐ {exp.rating}
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
