import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container-wide max-w-4xl">
          <h1 className="font-serif text-4xl font-bold mb-8">{t('nav.about')}</h1>
          <div className="prose prose-lg">
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">Angola is a country of extraordinary beauty and diversity, located on the southwestern coast of Africa. From the bustling capital of Luanda to the dramatic landscapes of Lubango, Angola offers travelers an authentic African experience unlike any other.</p>
            <p className="text-muted-foreground text-lg leading-relaxed">With over 1,600 kilometers of Atlantic coastline, ancient rock formations, lush rainforests, and rich cultural heritage, Angola is a destination waiting to be discovered.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
