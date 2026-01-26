import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, ChevronRight, Heart, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data - will be replaced with real data from database
const stays = [
  {
    id: '1',
    name: 'Hotel Presidente Luanda',
    slug: 'hotel-presidente-luanda',
    shortDescription: 'Luxury beachfront hotel with panoramic ocean views',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    location: 'Luanda',
    pricePerNight: 250,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 524,
    listingType: 'hotel',
    isVerified: true,
  },
  {
    id: '2',
    name: 'Eco Lodge Kissama',
    slug: 'eco-lodge-kissama',
    shortDescription: 'Sustainable lodge in the heart of Kissama National Park',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    location: 'Kissama',
    pricePerNight: 180,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 312,
    listingType: 'lodge',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Casa Colonial Benguela',
    slug: 'casa-colonial-benguela',
    shortDescription: 'Charming colonial-era guesthouse with modern comforts',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    location: 'Benguela',
    pricePerNight: 95,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 189,
    listingType: 'guesthouse',
    isVerified: true,
  },
  {
    id: '4',
    name: 'Serra da Leba Resort',
    slug: 'serra-da-leba-resort',
    shortDescription: 'Mountain retreat with breathtaking views of the escarpment',
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
    location: 'Lubango',
    pricePerNight: 220,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 276,
    listingType: 'hotel',
    isVerified: true,
  },
  {
    id: '5',
    name: 'Praia Morena Beach House',
    slug: 'praia-morena-beach-house',
    shortDescription: 'Private beachfront villa with stunning sunset views',
    imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    location: 'Namibe',
    pricePerNight: 320,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 156,
    listingType: 'apartment',
    isVerified: false,
  },
];

export function RecommendedStays() {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('section.stays')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              {t('section.staysSubtitle')}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
        >
          {stays.map((stay) => (
            <Link
              key={stay.id}
              to={`/stays/${stay.slug}`}
              className="flex-shrink-0 w-[340px] group card-hover"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-card">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={stay.imageUrl}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Favorite Button */}
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Toggle favorite logic
                    }}
                  >
                    <Heart className="w-5 h-5 text-foreground" />
                  </button>
                  {/* Verified Badge */}
                  {stay.isVerified && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-xs font-medium">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      Verified
                    </div>
                  )}
                  {/* Type Badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium capitalize">
                    {stay.listingType}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {stay.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 text-kamba-gold fill-kamba-gold" />
                      <span className="font-semibold text-sm">{stay.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    {stay.location}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {stay.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-foreground">
                        ${stay.pricePerNight}
                      </span>
                      <span className="text-muted-foreground text-sm ml-1">
                        / {t('card.perNight')}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {stay.reviewCount} {t('card.reviews')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-2"
            asChild
          >
            <Link to="/stays">{t('common.viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
