import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, ChevronRight, Heart, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { accommodationsApi, BACKEND_URL, type Accommodation } from '@/lib/api';
import { toast } from 'sonner';

export function RecommendedStays() {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [stays, setStays] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite_stays');
    return saved ? JSON.parse(saved) : [];
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleFavorite = (stayId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavorites = favorites.includes(stayId)
      ? favorites.filter(id => id !== stayId)
      : [...favorites, stayId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite_stays', JSON.stringify(newFavorites));
    
    const stay = stays.find(s => s.id === stayId);
    if (stay) {
      toast.success(
        favorites.includes(stayId)
          ? `Removido ${stay.name} dos favoritos`
          : `Adicionado ${stay.name} aos favoritos`
      );
    }
  };

  // Helper para formatar rating
  const formatRating = (rating: any): string => {
    if (rating === null || rating === undefined) return '0.0';
    const num = Number(rating);
    return !isNaN(num) ? num.toFixed(1) : '0.0';
  };

  // Helper para obter URL da imagem
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${BACKEND_URL}${imageUrl}`;
  };

  const fetchRecommendedStays = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching recommended stays...');
      const response = await accommodationsApi.list({
        per_page: 10,
        is_featured: true,
      });
      
      console.log('Recommended stays response:', response);
      
      if (response.success) {
        setStays(response.data);
      } else {
        setError('Erro ao carregar acomodações');
      }
    } catch (error) {
      console.error('Erro ao buscar stays:', error);
      setError('Erro ao carregar acomodações. Tente novamente.');
      toast.error('Erro ao carregar acomodações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedStays();
  }, []);

  const listingTypeLabels: Record<string, string> = {
    hotel: 'Hotel',
    lodge: 'Lodge',
    guesthouse: 'Pousada',
    hostel: 'Hostel',
    apartment: 'Apartamento',
  };

  if (loading) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {t('section.stays')}
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                {t('section.staysSubtitle')}
              </p>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[340px]">
                <div className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse">
                  <div className="aspect-[4/3] bg-gray-300" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-300 rounded" />
                    <div className="h-4 bg-gray-300 rounded" />
                    <div className="h-4 bg-gray-300 rounded w-2/3" />
                    <div className="h-8 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center py-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              {t('section.stays')}
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchRecommendedStays} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (stays.length === 0) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center py-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              {t('section.stays')}
            </h2>
            <p className="text-muted-foreground">
              Nenhuma acomodação disponível no momento
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
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

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
        >
          {stays.map((stay) => (
            <Link
              key={stay.id}
              to={`/accommodations/${stay.slug}`}
              className="flex-shrink-0 w-[340px] group card-hover"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-card">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getImageUrl(stay.image_url)}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    onClick={(e) => toggleFavorite(stay.id, e)}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors ${
                        favorites.includes(stay.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-foreground'
                      }`}
                    />
                  </button>
                  
                  {stay.is_verified && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-xs font-medium">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      Verificado
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium capitalize">
                    {listingTypeLabels[stay.listing_type] || stay.listing_type}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {stay.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 text-kamba-gold fill-kamba-gold" />
                      <span className="font-semibold text-sm">
                        {formatRating(stay.rating)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {stay.destination?.name || stay.region || 'Localização não disponível'}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {stay.short_description || 'Descrição não disponível'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-foreground">
                        {stay.currency || 'USD'} {stay.price_per_night || '0'}
                      </span>
                      <span className="text-muted-foreground text-sm ml-1">
                        / {t('card.perNight')}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {stay.review_count || 0} {t('card.reviews')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-2"
            asChild
          >
            <Link to="/accommodations">{t('common.viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}