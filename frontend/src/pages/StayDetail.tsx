import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function StayDetail() {
  const { slug } = useParams();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container-wide">
          <h1 className="font-serif text-3xl font-bold mb-4">Stay: {slug}</h1>
          <p className="text-muted-foreground">Stay details page coming soon...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
