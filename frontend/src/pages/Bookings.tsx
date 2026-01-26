import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/ApiAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { bookingsApi, type Booking } from '@/lib/api';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      setIsLoading(true);
      try {
        const response = await bookingsApi.list();
        if (response.success) {
          setBookings(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container-wide">
            <h1 className="font-serif text-3xl font-bold mb-8">My Bookings</h1>

            {isLoading ? (
              <div className="flex justify-center py-12 text-muted-foreground">
                Loading bookings…
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 shadow-card text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-semibold text-xl mb-2">No bookings yet</h2>
                <p className="text-muted-foreground">
                  When you book a stay or experience, it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-card rounded-2xl p-6 shadow-card">
                    <h3 className="font-semibold">
                      {booking.accommodation?.name || booking.experience?.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {booking.accommodation?.destination?.name ||
                        booking.experience?.destination?.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(booking.start_date).toLocaleDateString()} –{' '}
                      {new Date(booking.end_date).toLocaleDateString()}
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
