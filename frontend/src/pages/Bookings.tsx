import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { bookingsApi, type Booking } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle },
  completed: { label: 'Concluída', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
};

export default function Bookings() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsApi.myBookings({
        status: activeTab === 'upcoming' ? 'pending,confirmed' : 'cancelled,completed',
        order_by: 'created_at',
        order_direction: 'desc',
      });
      
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [activeTab]);

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;
    
    try {
      await bookingsApi.cancelBooking(id);
      toast.success('Reserva cancelada com sucesso');
      fetchMyBookings();
    } catch (error) {
      toast.error('Erro ao cancelar reserva');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const upcomingBookings = bookings.filter(b => 
    b.status === 'pending' || b.status === 'confirmed'
  );
  
  const pastBookings = bookings.filter(b => 
    b.status === 'cancelled' || b.status === 'completed'
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Minhas Reservas</h1>
        <p className="text-muted-foreground">Gerencie suas reservas e acompanhe o status</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Próximas ({upcomingBookings.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'past' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('past')}
        >
          Anteriores ({pastBookings.length})
        </button>
      </div>

      {/* Lista de Reservas */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayedBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {activeTab === 'upcoming' 
                ? 'Você não tem reservas futuras' 
                : 'Você não tem reservas anteriores'}
            </p>
            <Button asChild>
              <Link to="/accommodations">
                Explorar Hospedagens
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((booking) => {
            const StatusIcon = statusConfig[booking.status].icon;
            
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Informações da Reserva */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[booking.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[booking.status].label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          #{booking.id.slice(0, 8)}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg">
                        {booking.accommodation?.name || booking.experience?.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.check_in && booking.check_out ? (
                            <>
                              {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                              <span className="ml-1">
                                ({booking.guests} {booking.guests === 1 ? 'hóspede' : 'hóspedes'})
                              </span>
                            </>
                          ) : (
                            <>
                              {formatDate(booking.booking_date)}
                              {booking.booking_time && ` às ${booking.booking_time}`}
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {booking.accommodation?.destination?.name || booking.experience?.destination?.name}
                        </div>
                      </div>
                      
                      {booking.special_requests && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Pedidos especiais:</strong> {booking.special_requests}
                        </p>
                      )}
                    </div>

                    {/* Ações e Preço */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {booking.currency} {booking.total_price}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total pago
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={
                            booking.accommodation_id 
                              ? `/accommodations/${booking.accommodation?.slug}` 
                              : `/experiences/${booking.experience?.slug}`
                          }>
                            Ver detalhes
                          </Link>
                        </Button>
                        
                        {activeTab === 'upcoming' && booking.status === 'pending' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}