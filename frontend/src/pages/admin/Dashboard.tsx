import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Home, Compass, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { dashboardApi, type DashboardStats } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/ApiAuthContext';

export default function AdminDashboard() {
  const { user, isLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const response = await dashboardApi.stats();
        if (response.success) {
          setStats(response.data);
        } else {
          toast.error('Falha ao carregar estatísticas');
        }
      } catch (error) {
        toast.error('Erro ao carregar estatísticas');
        // valores default pra demo
        setStats({
          destinations_count: 18,
          accommodations_count: 156,
          experiences_count: 89,
          bookings_count: 1240,
          users_count: 5600,
          revenue_total: 125000,
          revenue_this_month: 15000,
        });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, isAdmin]);

  if (isLoading || !isAdmin)
  return (
    <div className="flex justify-center items-center h-[60vh] text-lg text-muted-foreground">
      Carregando...
    </div>
  );


  const cards = [
    { title: 'Destinos', value: stats?.destinations_count || 0, icon: MapPin, href: '/admin/destinations', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Hospedagens', value: stats?.accommodations_count || 0, icon: Home, href: '/admin/accommodations', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Experiências', value: stats?.experiences_count || 0, icon: Compass, href: '/admin/experiences', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'Reservas', value: stats?.bookings_count || 0, icon: Calendar, href: '/admin/bookings', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { title: 'Usuários', value: stats?.users_count || 0, icon: Users, href: '/admin/users', color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da plataforma Kamba Travel</p>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary to-kamba-ocean text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Receita Total</CardTitle>
              <DollarSign className="w-5 h-5 opacity-90" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Skeleton className="h-8 w-32 bg-white/20" /> : <div className="text-3xl font-bold">{formatCurrency(stats?.revenue_total || 0)}</div>}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-kamba-gold to-kamba-terracotta text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Receita do Mês</CardTitle>
              <TrendingUp className="w-5 h-5 opacity-90" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Skeleton className="h-8 w-32 bg-white/20" /> : <div className="text-3xl font-bold">{formatCurrency(stats?.revenue_this_month || 0)}</div>}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cards.map((card) => (
            <Link key={card.href} to={card.href}>
              <Card className="hover:shadow-medium transition-shadow cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingStats ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/destinations" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                <MapPin className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Novo Destino</span>
              </Link>
              <Link to="/admin/accommodations" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                <Home className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Nova Hospedagem</span>
              </Link>
              <Link to="/admin/experiences" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                <Compass className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Nova Experiência</span>
              </Link>
              <Link to="/admin/bookings" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Ver Reservas</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
