import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { destinationsApi,  BACKEND_URL } from '@/lib/api';
import type { Destination } from '@/lib/api';

export function FeaturedDestinations() {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching featured destinations...');
    destinationsApi.featured()
      .then(res => {
        console.log('Featured destinations response:', res);
        setDestinations(res.data || []);
      })
      .catch(err => {
        console.error('Erro ao buscar destinos destacados', err);
        setDestinations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="section-padding text-center">
        <p className="text-muted-foreground">Loading destinations...</p>
      </section>
    );
  }

  if (!destinations.length) {
    return null; // home limpa se não houver dados
  }

  return (
    <section className="section-padding bg-background pattern-tribal">
      <div className="container-wide">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('section.featured')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.featuredSubtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {destinations.map((destination, index) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.slug}`}
              className="group card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-card shadow-card">
                
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={`${BACKEND_URL}${destination.image_url}` || '/placeholder.jpg'}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">
                    {destination.name}
                  </h3>

                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {destination.short_description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-kamba-gold fill-kamba-gold" />
                      <span className="text-white font-semibold">
                        {Number(destination.rating).toFixed(1)}
                      </span>
                      <span className="text-white/60 text-sm">
                        ({destination.review_count})
                      </span>
                    </div>

                    <span className="text-white/80 text-sm font-medium flex items-center gap-1 group-hover:text-kamba-gold transition-colors">
                      {t('card.explore')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-xl border-2" asChild>
            <Link to="/cities">
              {t('common.viewAll')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
