import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data - will be replaced with real data from database
const destinations = [
  {
    id: '1',
    name: 'Luanda',
    slug: 'luanda',
    shortDescription: 'The vibrant capital city where modern Africa meets Atlantic charm',
    imageUrl: 'https://images.unsplash.com/photo-1611432579699-484f7990b127?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 2340,
  },
  {
    id: '2',
    name: 'Benguela',
    slug: 'benguela',
    shortDescription: 'Colonial architecture and stunning beaches on the southern coast',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 1856,
  },
  {
    id: '3',
    name: 'Lubango',
    slug: 'lubango',
    shortDescription: 'Mountain landscapes and the iconic Christ the King statue',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 1245,
  },
  {
    id: '4',
    name: 'Namibe',
    slug: 'namibe',
    shortDescription: 'Where the desert meets the ocean in spectacular fashion',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 987,
  },
];

export function FeaturedDestinations() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background pattern-tribal">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('section.featured')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.featuredSubtitle')}
          </p>
        </div>

        {/* Destinations Grid */}
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
                    src={destination.imageUrl}
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
                    {destination.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-kamba-gold fill-kamba-gold" />
                      <span className="text-white font-semibold">{destination.rating}</span>
                      <span className="text-white/60 text-sm">
                        ({destination.reviewCount.toLocaleString()})
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

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-2"
            asChild
          >
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
