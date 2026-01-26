import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedDestinations } from '@/components/home/FeaturedDestinations';
import { RecommendedStays } from '@/components/home/RecommendedStays';
import { ExperiencesSection } from '@/components/home/ExperiencesSection';
import { MapSection } from '@/components/home/MapSection';
import { TrustSection } from '@/components/home/TrustSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedDestinations />
        <RecommendedStays />
        <ExperiencesSection />
        <MapSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
