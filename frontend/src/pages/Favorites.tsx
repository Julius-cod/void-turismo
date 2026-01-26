import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/ApiAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { bookingsApi } from '@/lib/api';

type FavoriteItem = {
  id: string;
  accommodation?: {
    name: string;
    destination?: { name: string };
  };
  experience?: {
    name: string;
    destination?: { name: string };
  };
};

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchFavorites() {
      setIsLoading(true);
      try {
        // TEMP: usando bookingsApi até existir favoritesApi
        const response = await bookingsApi.list();
        if (response.success) {
          setFavorites(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container-wide">
            <h1 className="font-serif text-3xl font-bold mb-8">My Favorites</h1>

            {isLoading ? (
              <div className="flex justify-center py-12 text-muted-foreground">
                Loading favorites…
              </div>
            ) : favorites.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 shadow-card text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-semibold text-xl mb-2">No favorites yet</h2>
                <p className="text-muted-foreground">
                  Start exploring and save your favorite stays and experiences!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((fav) => (
                  <div key={fav.id} className="bg-card rounded-2xl p-6 shadow-card">
                    <h3 className="font-semibold">
                      {fav.accommodation?.name || fav.experience?.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {fav.accommodation?.destination?.name ||
                        fav.experience?.destination?.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
