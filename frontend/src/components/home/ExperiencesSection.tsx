import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data - will be replaced with real data from database
const experiences = [
  {
    id: '1',
    name: 'Luanda City Walking Tour',
    slug: 'luanda-city-walking-tour',
    shortDescription: 'Explore the historic Cidade Alta and vibrant Marginal promenade',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    category: 'city_tour',
    location: 'Luanda',
    price: 45,
    currency: 'USD',
    durationHours: 4,
    rating: 4.9,
    maxParticipants: 12,
  },
  {
    id: '2',
    name: 'Traditional Cooking Class',
    slug: 'traditional-cooking-class',
    shortDescription: 'Learn to prepare authentic Angolan dishes with local ingredients',
    imageUrl: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80',
    category: 'food',
    location: 'Luanda',
    price: 65,
    currency: 'USD',
    durationHours: 3,
    rating: 4.8,
    maxParticipants: 8,
  },
  {
    id: '3',
    name: 'Kissama Safari Adventure',
    slug: 'kissama-safari-adventure',
    shortDescription: 'Witness elephants, giraffes and more in their natural habitat',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    category: 'nature',
    location: 'Kissama',
    price: 150,
    currency: 'USD',
    durationHours: 8,
    rating: 4.9,
    maxParticipants: 6,
  },
  {
    id: '4',
    name: 'Mussulo Beach Day Trip',
    slug: 'mussulo-beach-day-trip',
    shortDescription: 'Relax on pristine beaches and enjoy fresh seafood',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    category: 'beach',
    location: 'Mussulo Island',
    price: 85,
    currency: 'USD',
    durationHours: 6,
    rating: 4.7,
    maxParticipants: 10,
  },
  {
    id: '5',
    name: 'Kizomba Dance Workshop',
    slug: 'kizomba-dance-workshop',
    shortDescription: 'Learn the sensual Kizomba dance from local masters',
    imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
    category: 'cultural',
    location: 'Luanda',
    price: 35,
    currency: 'USD',
    durationHours: 2,
    rating: 4.8,
    maxParticipants: 20,
  },
  {
    id: '6',
    name: 'Tundavala Fissure Hike',
    slug: 'tundavala-fissure-hike',
    shortDescription: 'Trek to dramatic cliff viewpoints with 1000m drops',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    category: 'adventure',
    location: 'Lubango',
    price: 95,
    currency: 'USD',
    durationHours: 5,
    rating: 4.9,
    maxParticipants: 8,
  },
];

const categoryColors: Record<string, string> = {
  city_tour: 'bg-primary/10 text-primary',
  food: 'bg-kamba-terracotta/10 text-kamba-terracotta',
  nature: 'bg-green-500/10 text-green-600',
  beach: 'bg-blue-500/10 text-blue-600',
  cultural: 'bg-purple-500/10 text-purple-600',
  adventure: 'bg-orange-500/10 text-orange-600',
};

const categoryLabels: Record<string, string> = {
  city_tour: 'City Tour',
  food: 'Food & Drink',
  nature: 'Nature',
  beach: 'Beach',
  cultural: 'Cultural',
  adventure: 'Adventure',
};

export function ExperiencesSection() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('section.experiences')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.experiencesSubtitle')}
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              to={`/experiences/${experience.slug}`}
              className="group card-hover"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-card h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={experience.imageUrl}
                    alt={experience.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      categoryColors[experience.category]
                    }`}
                  >
                    {categoryLabels[experience.category]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {experience.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 text-kamba-gold fill-kamba-gold" />
                      <span className="font-semibold text-sm">{experience.rating}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {experience.shortDescription}
                  </p>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {experience.durationHours}h
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {experience.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      Max {experience.maxParticipants}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-muted-foreground text-sm">{t('common.from')}</span>
                      <span className="text-xl font-bold text-foreground ml-2">
                        ${experience.price}
                      </span>
                      <span className="text-muted-foreground text-sm">/person</span>
                    </div>
                    <Button
                      size="sm"
                      className="btn-gradient rounded-lg"
                    >
                      {t('common.bookNow')}
                    </Button>
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
            <Link to="/experiences">{t('common.viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
