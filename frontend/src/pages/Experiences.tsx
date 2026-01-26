import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Experiences() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container-wide">
          <h1 className="font-serif text-4xl font-bold mb-4">{t('nav.experiences')}</h1>
          <p className="text-muted-foreground text-lg mb-8">Discover unique experiences across Angola</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-8 shadow-card text-center">
              <p className="text-muted-foreground">Experiences listings coming soon...</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
