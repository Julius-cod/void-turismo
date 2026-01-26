import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock destination markers
const markers = [
  { id: '1', name: 'Luanda', lat: -8.839, lng: 13.289, count: 150 },
  { id: '2', name: 'Benguela', lat: -12.578, lng: 13.405, count: 45 },
  { id: '3', name: 'Lubango', lat: -14.918, lng: 13.496, count: 38 },
  { id: '4', name: 'Namibe', lat: -15.196, lng: 12.152, count: 25 },
  { id: '5', name: 'Huambo', lat: -12.776, lng: 15.739, count: 32 },
  { id: '6', name: 'Cabinda', lat: -5.556, lng: 12.189, count: 18 },
];

export function MapSection() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('section.map')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('section.mapSubtitle')}
          </p>
        </div>

        {/* Map Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-large bg-card">
          {/* Map Placeholder - Will be replaced with Google Maps */}
          <div className="aspect-[16/9] lg:aspect-[21/9] relative bg-gradient-to-br from-primary/5 to-accent/5">
            {/* Angola Map SVG Background */}
            <svg
              viewBox="0 0 800 600"
              className="absolute inset-0 w-full h-full opacity-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                d="M400 100 L550 150 L600 300 L580 450 L450 550 L300 520 L200 400 L220 250 L300 120 Z"
                className="text-primary"
                fill="hsl(var(--primary) / 0.1)"
              />
            </svg>

            {/* Destination Markers */}
            {markers.map((marker, index) => {
              // Simplified positioning for demonstration
              const positions: Record<string, { top: string; left: string }> = {
                Luanda: { top: '35%', left: '30%' },
                Benguela: { top: '55%', left: '32%' },
                Lubango: { top: '68%', left: '34%' },
                Namibe: { top: '72%', left: '25%' },
                Huambo: { top: '50%', left: '50%' },
                Cabinda: { top: '12%', left: '25%' },
              };
              const pos = positions[marker.name] || { top: '50%', left: '50%' };

              return (
                <button
                  key={marker.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ top: pos.top, left: pos.left }}
                >
                  {/* Marker */}
                  <div className="relative">
                    {/* Pulse Effect */}
                    <div className="absolute inset-0 w-12 h-12 -m-3 rounded-full bg-primary/20 animate-ping" />
                    
                    {/* Marker Icon */}
                    <div className="relative w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-medium group-hover:scale-125 transition-transform">
                      <MapPin className="w-3 h-3 text-primary-foreground" />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-card shadow-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      <div className="font-semibold text-sm text-foreground">{marker.name}</div>
                      <div className="text-xs text-muted-foreground">{marker.count} listings</div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-card" />
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Decorative Elements */}
            <div className="absolute bottom-8 right-8 flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-foreground">Live availability</span>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute top-8 left-8 p-4 rounded-xl bg-card/95 backdrop-blur-sm shadow-soft">
              <h4 className="font-semibold text-foreground mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Major Cities (6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-kamba-terracotta" />
                  <span className="text-muted-foreground">Accommodations (308)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-kamba-gold" />
                  <span className="text-muted-foreground">Experiences (124)</span>
                </div>
              </div>
            </div>

            {/* CTA Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="btn-gradient rounded-xl shadow-large"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Explore on Map
              </Button>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Interactive map coming soon with Google Maps integration
        </p>
      </div>
    </section>
  );
}
