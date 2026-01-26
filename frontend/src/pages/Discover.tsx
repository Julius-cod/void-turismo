import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Discover() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container-wide">
          <h1 className="font-serif text-4xl font-bold mb-4">{t('nav.discover')}</h1>
          <p className="text-muted-foreground text-lg mb-8">Search and discover all of Angola</p>
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <p className="text-muted-foreground text-center">Search results will appear here...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
