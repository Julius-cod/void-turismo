import { ShieldCheck, Home, Compass, Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function TrustSection() {
  const { t } = useLanguage();

  const trustItems = [
    {
      icon: ShieldCheck,
      title: t('trust.verified'),
      description: t('trust.verifiedDesc'),
    },
    {
      icon: Home,
      title: t('trust.safe'),
      description: t('trust.safeDesc'),
    },
    {
      icon: Compass,
      title: t('trust.local'),
      description: t('trust.localDesc'),
    },
    {
      icon: Headphones,
      title: t('trust.support'),
      description: t('trust.supportDesc'),
    },
  ];

  return (
    <section className="section-padding bg-primary text-primary-foreground pattern-kente relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/2 translate-y-1/2" />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('section.trust')}
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We're committed to making your Angolan adventure safe, memorable, and hassle-free
          </p>
        </div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
                <item.icon className="w-8 h-8 text-kamba-gold" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-kamba-gold mb-2">500+</div>
              <div className="text-primary-foreground/60 text-sm">Verified Stays</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-kamba-gold mb-2">50+</div>
              <div className="text-primary-foreground/60 text-sm">Unique Experiences</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-kamba-gold mb-2">18</div>
              <div className="text-primary-foreground/60 text-sm">Provinces Covered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-kamba-gold mb-2">10k+</div>
              <div className="text-primary-foreground/60 text-sm">Happy Travelers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
