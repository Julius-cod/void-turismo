import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/BookingModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { experiencesApi, BACKEND_URL, type Experience } from '@/lib/api';
import { toast } from 'sonner';

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
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  
  // Helper para formatar rating
  const formatRating = (rating: any): string => {
    if (rating === null || rating === undefined) return '0.0';
    const num = Number(rating);
    return !isNaN(num) ? num.toFixed(1) : '0.0';
  };

  // Helper para obter URL da imagem
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${BACKEND_URL}${imageUrl}`;
  };

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [ExperiencesSection] Fetching experiences...');
      const response = await experiencesApi.list({
        per_page: 6,
        is_featured: true,
      });
      
      console.log('📦 [ExperiencesSection] Full response:', response);
      console.log('✅ [ExperiencesSection] Success:', response.success);
      console.log('📊 [ExperiencesSection] Data:', response.data);
      console.log('🔢 [ExperiencesSection] Data length:', response.data?.length || 0);
      console.log('📋 [ExperiencesSection] Is array?:', Array.isArray(response.data));
      
      if (response.success && Array.isArray(response.data)) {
        setExperiences(response.data);
        console.log('💾 [ExperiencesSection] State set with', response.data.length, 'items');
      } else {
        console.error('❌ [ExperiencesSection] Invalid response format:', response);
        setError('Erro ao carregar experiências: formato inválido');
        setExperiences([]);
      }
    } catch (error) {
      console.error('💥 [ExperiencesSection] Error:', error);
      setError('Erro ao carregar experiências. Tente novamente.');
      toast.error('Erro ao carregar experiências');
      setExperiences([]);
    } finally {
      setLoading(false);
      console.log('🏁 [ExperiencesSection] Loading set to false');
    }
  };

  useEffect(() => {
    console.log('🎬 [ExperiencesSection] Component mounted, fetching...');
    fetchExperiences();
  }, []);

  // Depuração do estado atual
  console.log('🎯 [ExperiencesSection] Current state:', { 
    loading, 
    error, 
    experiencesCount: experiences.length,
    hasExperiences: experiences.length > 0
  });

  // Se estiver carregando
  if (loading) {
    console.log('⏳ [ExperiencesSection] Rendering loading state...');
    return (
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('section.experiences')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('section.experiencesSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card h-full flex flex-col animate-pulse">
                <div className="aspect-[16/10] bg-gray-300" />
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  <div className="h-6 bg-gray-300 rounded" />
                  <div className="h-4 bg-gray-300 rounded" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 rounded w-20" />
                    <div className="h-4 bg-gray-300 rounded w-20" />
                    <div className="h-4 bg-gray-300 rounded w-20" />
                  </div>
                  <div className="h-10 bg-gray-300 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Se houver erro
  if (error) {
    console.log('❌ [ExperiencesSection] Rendering error state:', error);
    return (
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('section.experiences')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              {error}
            </p>
            <Button onClick={fetchExperiences} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Se não houver experiências
  if (experiences.length === 0) {
    console.log('📭 [ExperiencesSection] Rendering empty state...');
    return (
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('section.experiences')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nenhuma experiência disponível no momento
            </p>
            <Button onClick={fetchExperiences} variant="outline" className="mt-4">
              Recarregar
            </Button>
          </div>
        </div>
      </section>
    );
  }

  console.log('🎨 [ExperiencesSection] Rendering experiences grid with', experiences.length, 'items');

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
          {experiences.map((experience) => {
            console.log('🎪 Rendering experience:', experience.id, experience.name);
            return (
              <div
                key={experience.id}
                className="group card-hover"
              >
                <Link
                  to={`/experiences/${experience.slug}`}
                  className="block"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-card h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={getImageUrl(experience.image_url)}
                        alt={experience.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      {/* Category Badge */}
                      {experience.category && (
                        <div
                          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            categoryColors[experience.category] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {categoryLabels[experience.category] || experience.category}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {experience.name || 'Sem nome'}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-4 h-4 text-kamba-gold fill-kamba-gold" />
                          <span className="font-semibold text-sm">
                            {formatRating(experience.rating)}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {experience.short_description || 'Descrição não disponível'}
                      </p>

                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {experience.duration_hours || '?'}h
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {experience.destination?.name || experience.location || 'Local não especificado'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          Max {experience.max_participants || '?'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Price e Book Button - FORA do Link */}
                <div className="p-5 pt-0 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-muted-foreground text-sm">{t('common.from')}</span>
                    <span className="text-xl font-bold text-foreground ml-2">
                      {experience.currency || 'USD'} {experience.price || '0'}
                    </span>
                    <span className="text-muted-foreground text-sm">/person</span>
                  </div>
                  <Button
                    size="sm"
                    className="btn-gradient rounded-lg"
                    onClick={() => {
                      console.log('📅 Booking experience:', experience.id, experience.name);
                      setSelectedExperience(experience);
                      setBookingModalOpen(true);
                    }}
                  >
                    {t('common.bookNow')}
                  </Button>
                </div>
              </div>
            );
          })}
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
      
      {/* Booking Modal */}
      {selectedExperience && (
        <BookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          item={selectedExperience}
          type="experience"
        />
      )}
    </section>
  );
}